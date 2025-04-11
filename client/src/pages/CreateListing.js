import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateListing.css";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
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
    formData.append("address", address);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("landlordEmail", landlordEmail);
    formData.append("availableFrom", availableFrom);
    formData.append("availableUntil", availableUntil);
    formData.append("propertyType", propertyType);

    features.split(",").forEach((feature) => {
      formData.append("features", feature.trim());
    });

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    // ✅ Debug log of formData entries
    console.log("🚀 Submitting listing with:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/listings/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Listing created:", res.data);
      alert("Listing successfully created!");
    } catch (error) {
      console.error("❌ Error creating listing:");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else {
        console.error("Generic error:", error.message);
      }
      alert("❌ Failed to create listing. Check console for debug.");
    }
  };

  return (
    <div className="create-listing-container">
      <h1>Create New Listing</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>

        <div className="form-group">
          <label>Features (comma-separated)</label>
          <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Landlord Email</label>
          <input type="email" value={landlordEmail} onChange={(e) => setLandlordEmail(e.target.value)} required />
        </div>

        <div className="form-group date-fields">
          <div className="form-group">
            <label>Available From</label>
            <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Available Until</label>
            <input type="date" value={availableUntil} onChange={(e) => setAvailableUntil(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label>Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
            <option value="">Select</option>
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
