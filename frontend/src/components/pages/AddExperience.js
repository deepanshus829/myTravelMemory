import React, { useState } from "react";
import { baseUrl } from "../../url";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddExperience() {
  const [loading, setLoading] = useState(false)
    const [formdata, setFormdata] = useState({
            tripName: "",
            startDateOfJourney: "",
            endDateOfJourney: "",
            nameOfHotels: "",
            placesVisited: "",
            totalCost: 0,
            experience: "",
            image: "",
            tripType: "",
            featured: false,
            shortDescription: ""
    })
    const submitForm = async (e) => {
        if (e) e.preventDefault();

        // Validation for mandatory fields
        if (!formdata.tripName || !formdata.startDateOfJourney || !formdata.endDateOfJourney || formdata.tripType === "select" || !formdata.tripType || !formdata.image || !formdata.experience) {
            toast.error("Please fill in all mandatory fields (*).");
            return;
        }

        setLoading(true);
        console.log(formdata)
        try {
            await axios.post(`${baseUrl}/trip`, formdata);
            toast.success("Experience added successfully!");
            setFormdata({
                tripName: "",
                startDateOfJourney: "",
                endDateOfJourney: "",
                nameOfHotels: "",
                placesVisited: "",
                totalCost: 0,
                experience: "",
                image: "",
                tripType: "",
                featured: false,
                shortDescription: ""
            });
        } catch (error) {
            console.error("Error adding experience:", error);
            toast.error("Failed to add experience. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if(loading){
      return(
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      )
    }

    return (
      <div className="container py-5" style={{ maxWidth: "800px" }}>
        <div className="card shadow-lg border-0 rounded-lg">
          <div className="card-header bg-primary text-white text-center py-4 rounded-top">
            <h2 className="mb-0 fw-bold">Share Your Journey</h2>
            <p className="mb-0 text-light mt-1">We'd love to hear about your travel experience</p>
          </div>
          <div className="card-body p-5">
            <form onSubmit={submitForm}>
              <div className="mb-4">
                <label htmlFor="tripName" className="form-label fw-semibold">
                  Trip Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light"
                  id="tripName"
                  placeholder="E.g., Summer in Paris"
                  value={formdata.tripName}
                  onChange={(e) => setFormdata({...formdata, tripName: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Trip Dates <span className="text-danger">*</span>
                </label>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="date" className="form-control bg-light" id="startDate"
                        value={formdata.startDateOfJourney}
                        onChange={(e)=> setFormdata({...formdata, startDateOfJourney: e.target.value})}
                      />
                      <label htmlFor="startDate">Start Date</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input type="date" className="form-control bg-light" id="endDate"
                        value={formdata.endDateOfJourney}
                        onChange={(e)=> setFormdata({...formdata, endDateOfJourney: e.target.value})}
                      />
                      <label htmlFor="endDate">End Date</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="nameOfHotels" className="form-label fw-semibold">
                  Name of Hotels
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
                  id="nameOfHotels"
                  placeholder="Where did you stay?"
                  value={formdata.nameOfHotels}
                  onChange={(e)=> setFormdata({...formdata, nameOfHotels: e.target.value})}
                />
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label htmlFor="tripType" className="form-label fw-semibold">
                    Trip Type <span className="text-danger">*</span>
                  </label>
                  <select className="form-select bg-light" id="tripType"
                    value={formdata.tripType}
                    onChange={(e)=> setFormdata({...formdata, tripType: e.target.value})}
                  >
                    <option value="select">Select One</option>
                    <option value="backpacking">Backpacking</option>
                    <option value="leisure">Leisure</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="totalCost" className="form-label fw-semibold">
                    Total Cost
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">$</span>
                    <input
                      type="number"
                      className="form-control bg-light"
                      id="totalCost"
                      placeholder="999"
                      value={formdata.totalCost}
                      onChange={(e)=> setFormdata({...formdata, totalCost: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="placesVisited" className="form-label fw-semibold">
                  Places Visited
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
                  id="placesVisited"
                  placeholder="E.g., Eiffel Tower, Louvre Museum"
                  value={formdata.placesVisited}
                  onChange={(e)=> setFormdata({...formdata, placesVisited: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold d-block">
                  Featured Trip?
                </label>
                <div className="d-flex gap-4">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="featuredTrue"
                      value={true}
                      onChange={(e)=> setFormdata({...formdata, featured: true})}
                      checked={formdata.featured === true}
                    />
                    <label className="form-check-label" htmlFor="featuredTrue">Yes</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="featuredFalse"
                      value={false}
                      onChange={(e)=> setFormdata({...formdata, featured: false})}
                      checked={formdata.featured === false}
                    />
                    <label className="form-check-label" htmlFor="featuredFalse">No</label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="form-label fw-semibold">
                  Image Link <span className="text-danger">*</span>
                </label>
                <input
                  type="url"
                  className="form-control bg-light"
                  id="image"
                  placeholder="https://example.com/image.png"
                  value={formdata.image}
                  onChange={(e)=> setFormdata({...formdata, image: e.target.value})}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="shortDescription" className="form-label fw-semibold">
                  Short Description
                </label>
                <textarea
                  className="form-control bg-light"
                  id="shortDescription"
                  rows="2"
                  placeholder="A quick summary of your trip..."
                  value={formdata.shortDescription}
                  onChange={(e)=> setFormdata({...formdata, shortDescription: e.target.value})}
                ></textarea>
              </div>

              <div className="mb-5">
                <label htmlFor="experience" className="form-label fw-semibold">
                  Detailed Experience <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control bg-light"
                  id="experience"
                  rows="6"
                  placeholder="Share the full story of your adventure..."
                  value={formdata.experience}
                  onChange={(e)=> setFormdata({...formdata, experience: e.target.value})}
                ></textarea>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg fw-bold py-3 shadow-sm">
                  Submit Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );

  
}
