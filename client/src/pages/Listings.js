import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/listings");
        setListings(response.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="listings-container">
      <h2>🏡 Available Listings</h2>

      {listings.map((listing) => (
        <div key={listing._id} className="listing-card">
          <h3>{listing.title}</h3>
          <p><strong>Location:</strong> {listing.location}</p>
          <p><strong>Price:</strong> {listing.price}</p>
          <p><strong>Description:</strong> {listing.description}</p>
          <p><strong>Features:</strong> {listing.features.join(', ')}</p>
          <p><strong>Posted by:</strong> {listing.landlordEmail}</p>

          {/* Display images */}
          {listing.images && Array.isArray(listing.images) && listing.images.map((image, index) => {
            // Check if the image path is relative to your server path and update accordingly
            const imageURL = `http://localhost:5000/uploads/${image.split("\\").pop()}`;
            return <img key={index} src={imageURL} alt={`listing-image-${index}`} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default Listings;
