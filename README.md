# Travel Memory Application Deployment (MERN Stack on AWS EC2)

## 📌 Introduction

The Travel Memory application is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This document outlines the complete deployment process on AWS EC2, including backend setup, frontend configuration, load balancing, and scaling.

---

# 🚀 1. Backend Setup

## 1.1 Launch EC2 Instance

* Instance Type: t2.micro
* OS: Ubuntu
* Security Group: Allow ports **22 (SSH), 80 (HTTP), 5000 (Backend)**

---

## 1.2 Install Node.js

```bash
sudo apt update
sudo apt install nodejs npm -y
node -v
npm -v
```

---

## 1.3 Clone Repository

```bash
git clone https://github.com/UnpredictablePrashant/TravelMemory.git
cd TravelMemory/backend
```

---

## 1.4 Install Dependencies

```bash
npm install
```

---

## 1.5 Configure Environment Variables (.env)

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## 1.6 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

## 1.7 Start Backend Server

```bash
pm2 start index.js --name backend
pm2 save
pm2 startup
```

---

## 1.8 Verify Backend

```bash
curl http://localhost:5000/trip
```

---

# 🎨 2. Frontend Setup

## 2.1 Navigate to Frontend

```bash
cd ~/TravelMemory/frontend
```

---

## 2.2 Install Dependencies

```bash
npm install
```

---

## 2.3 Update Backend URL

Edit:

```bash
src/url.js
```

```js
export const baseUrl = "http://travel-memory-alb-1297786136.ap-south-1.elb.amazonaws.com";
```

---

## 2.4 Build React App

```bash
npm run build
```

---

## 2.5 Install and Configure Nginx

```bash
sudo apt install nginx -y
```

---

## 2.6 Deploy Build to Nginx

```bash
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
```

---

## 2.7 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

### Configuration:

```nginx
server {
    listen 80;

    root /var/www/html;
    index index.html;

    location /static/ {
        try_files $uri =404;
    }

    location /trip {
        proxy_pass http://localhost:5000;
    }

    location / {
        try_files $uri /index.html;
    }
}
```

---

## 2.8 Restart Nginx

```bash
sudo systemctl restart nginx
```

---

# ⚖️ 3. Load Balancer Setup

## 3.1 Create Target Group

* Target Type: Instance
* Protocol: HTTP
* Port: 5000
* Health Check Path: `/trip`

---

## 3.2 Register Targets

* Add both EC2 instances
* Ensure status becomes **Healthy**

---

## 3.3 Create Application Load Balancer

* Type: Application Load Balancer
* Scheme: Internet-facing
* Listener: HTTP (Port 80)
* Forward to Target Group

---

## 3.4 Verify Load Balancer

Access:

```text
http://travel-memory-alb-1297786136.ap-south-1.elb.amazonaws.com
```

---

# 📈 4. Scaling the Application

## 4.1 Create Multiple EC2 Instances

* Instance 1 → Backend + Frontend
* Instance 2 → Backend + Frontend

---

## 4.2 Deploy Same Code on Both Instances

* Clone repository
* Setup backend (PM2)
* Setup frontend (Nginx)

---

## 4.3 Add Instances to Load Balancer

* Register both instances in target group
* Verify health checks

---

## 4.4 Load Distribution

* Traffic is distributed automatically by ALB
* Ensures high availability and fault tolerance

---

# 🌐 5. Final Application URL

```text
http://travel-memory-alb-1297786136.ap-south-1.elb.amazonaws.com
```

---

# 🧠 Key Features Achieved

* Full MERN stack deployment
* Reverse proxy using Nginx
* Process management using PM2
* Load balancing using AWS ALB
* Scalable architecture with multiple EC2 instances

---

# ⚠️ Challenges Faced

* Nginx misconfiguration causing JS 404 errors
* React build caching issues
* Backend validation errors
* EC2 IP changes (resolved using ALB)

---

# ✅ Conclusion

The Travel Memory application has been successfully deployed on AWS EC2 with a scalable and production-ready architecture. The use of an Application Load Balancer ensures high availability and efficient traffic distribution across multiple instances.

---
