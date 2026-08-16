# TravelMemory Deployment Guide (Terraform & Ansible)

This repository contains the deployment automation for the **MERN (MongoDB, Express, React, Node.js) TravelMemory Application**. The setup is divided into two primary sections:

1. **Infrastructure Provisioning with Terraform**: Sets up a secure, highly-available AWS network (VPC, Subnets, Gateways) and provisions EC2 instances.
2. **Configuration Management & Application Deployment with Ansible**: Installs, configures, and secures MongoDB on a private DB instance, and builds/runs the Node.js backend and React frontend on a public Web instance.

---

## Architecture Overview

```mermaid
graph TD
    subgraph AWS VPC (10.0.0.0/16)
        subgraph Public Subnet (10.0.1.0/24)
            IGW[Internet Gateway]
            WebSG[Web Security Group]
            WebEC2["Web Server (EC2)<br>Node.js Backend & React Frontend (Nginx Proxy)"]
            
            IGW <--> WebEC2
            WebEC2 --- WebSG
        end

        subgraph Private Subnet (10.0.2.0/24)
            DBSG[Database Security Group]
            DBEC2["Database Server (EC2)<br>Secured MongoDB"]
            NAT[NAT Gateway]
            
            DBEC2 --- DBSG
            DBEC2 --> NAT
        end
    end
    
    NAT --> IGW
    WebEC2 -- Port 27017 (MongoDB) --> DBEC2
    Developer[Developer / Operator] -- SSH (Port 22) --> WebEC2
```

- **VPC Network**: 10.0.0.0/16 address space.
- **Public Subnet**: Hosts the Web server and has direct internet access via an Internet Gateway.
- **Private Subnet**: Hosts the MongoDB database server. It has no public IP and routes outbound traffic via a NAT Gateway for package updates.
- **Security hardening**: 
  - The database is completely isolated in the private subnet; it only accepts incoming traffic on port `27017` from the Web Server's Security Group.
  - SSH access is restricted, and root logins are hardened.

---

## Part 1: Infrastructure Setup with Terraform

### 1. Prerequisites
- [Terraform](https://www.terraform.io/downloads) (v1.5+ recommended) installed.
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured (`aws configure`).

### 2. Configuration (`terraform/`)
Navigate to the `terraform/` directory:
- [provider.tf](file:///d:/auropayrepos/myTravelMemory/terraform/provider.tf): Configures AWS provider.
- [vpc.tf](file:///d:/auropayrepos/myTravelMemory/terraform/vpc.tf): Declares the VPC, Internet Gateway, NAT Gateway, Public/Private subnets, and Route Tables.
- [security_groups.tf](file:///d:/auropayrepos/myTravelMemory/terraform/security_groups.tf): Defines the firewall rules.
  - Web Server allows SSH (restricted to configured IPs) and HTTP (Port 80).
  - Database Server allows inbound MongoDB traffic (Port 27017) *only* from the Web Server's security group.
- [ec2.tf](file:///d:/auropayrepos/myTravelMemory/terraform/ec2.tf): Deploys the Amazon Linux EC2 instances. 
  - Note: The database instance uses `associate_public_ip_address = false` to guarantee isolation.
- [iam.tf](file:///d:/auropayrepos/myTravelMemory/terraform/iam.tf): IAM roles and instance profiles for future extensions.
- [variables.tf](file:///d:/auropayrepos/myTravelMemory/terraform/variables.tf) / [outputs.tf](file:///d:/auropayrepos/myTravelMemory/terraform/outputs.tf): Parameterizes and outputs resource data.

### 3. Deployment Steps
1. **Initialize Terraform**:
   ```bash
   cd terraform
   terraform init
   ```
2. **Plan & Validate**:
   ```bash
   terraform plan
   ```
3. **Apply Configuration**:
   ```bash
   terraform apply
   ```
4. **Outputs**:
   Upon completion, note the outputs:
   - `web_public_ip`: The external IP address to access the app and SSH.
   - `database_private_ip`: The internal IP of the MongoDB instance.

---

## Part 2: Configuration and Deployment with Ansible

Ansible automates package installation, database setup, environment variable templating, and server startup.

### 1. Prerequisites
- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) installed on your control machine.
- Your SSH private key (`travel-memory-key.pem`) available on your local path.

### 2. Configuration (`ansible/`)
Navigate to the `ansible/` directory:
- **Inventory File** ([inventory.ini](file:///d:/auropayrepos/myTravelMemory/ansible/inventory.ini)): Update this file with the output public/private IPs from Terraform:
  ```ini
  [web]
  web_server ansible_host=<YOUR_WEB_PUBLIC_IP> ansible_user=ec2-user ansible_ssh_private_key_file=../travel-memory-key.pem

  [database]
  db_server ansible_host=<YOUR_DB_PRIVATE_IP> ansible_user=ec2-user ansible_ssh_private_key_file=../travel-memory-key.pem ansible_ssh_common_args='-o ProxyCommand="ssh -W %h:%p -q ec2-user@<YOUR_WEB_PUBLIC_IP> -i ../travel-memory-key.pem"'
  ```
- **Variables** ([group_vars/all.yml](file:///d:/auropayrepos/myTravelMemory/ansible/group_vars/all.yml)): Define database parameters, database users, backend ports, and the app repository URL.
- **Playbooks** ([playbooks/](file:///d:/auropayrepos/myTravelMemory/ansible/playbooks/)):
  - [mongodb.yml](file:///d:/auropayrepos/myTravelMemory/ansible/playbooks/mongodb.yml): Configures MongoDB repository, installs the database, updates configuration to bind internally, enables authorization, and creates a database admin user.
  - [application.yml](file:///d:/auropayrepos/myTravelMemory/ansible/playbooks/application.yml): Installs Node.js & NPM, clones the application, installs dependencies, constructs the `.env` configuration, builds the React frontend, sets up Systemd for background execution, and proxies traffic via Nginx.

### 3. Execution Steps
Run the playbooks in order:

1. **Deploy and Secure MongoDB**:
   ```bash
   ansible-playbook -i inventory.ini playbooks/mongodb.yml
   ```
2. **Deploy MERN Web & Frontend**:
   ```bash
   ansible-playbook -i inventory.ini playbooks/application.yml
   ```

---

## Application Access & Format

Once deployed, the application will be accessible via HTTP at the public IP address of your web server: `http://<YOUR_WEB_PUBLIC_IP>`.

### Data format to be added:
```json
{
    "tripName": "Incredible India",
    "startDateOfJourney": "19-03-2022",
    "endDateOfJourney": "27-03-2022",
    "nameOfHotels":"Hotel Namaste, Backpackers Club",
    "placesVisited":"Delhi, Kolkata, Chennai, Mumbai",
    "totalCost": 800000,
    "tripType": "leisure",
    "experience": "Lorem Ipsum...",
    "image": "https://t3.ftcdn.net/jpg/03/04/85/26/360_F_304852693_nSOn9KvUgafgvZ6wM0CNaULYUa7xXBkA.jpg",
    "shortDescription":"India is a wonderful country with rich culture and good people.",
    "featured": true
}
```