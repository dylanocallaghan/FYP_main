import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateListing.css";


const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [landlordEmail, setLandlordEmail] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("features", features);
    formData.append("landlordEmail", landlordEmail);
    formData.append("availableFrom", availableFrom);
    formData.append("availableUntil", availableUntil);
    formData.append("propertyType", propertyType);

    // Append images to form data
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await axios.post("http://localhost:5000/api/listings/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message); // Show success message
    } catch (err) {
      console.error(err);
      alert("Failed to create listing. Please try again.");
    }
  };

  return (
    <div className="create-listing-container">
      <h1>Create New Listing</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Features (comma-separated)</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Landlord Email</label>
          <input
            type="email"
            value={landlordEmail}
            onChange={(e) => setLandlordEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group date-fields">
          <div className="date-fields form-group">
            <label>Available From</label>
            <input
              type="date"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              required
            />
          </div>
          <div className="date-fields form-group">
            <label>Available Until</label>
            <input
              type="date"
              value={availableUntil}
              onChange={(e) => setAvailableUntil(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Property Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            required
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
          </select>
        </div>
        <div className="form-group">
          <label>Upload Images</label>
          <input
            type="file"
            name="images"
            onChange={(e) => setImages(e.target.files)}
            multiple
            accept="image/png, image/jpeg, image/jpg, image/gif"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
