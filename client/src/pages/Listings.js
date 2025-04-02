// client/src/pages/Listings.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

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

  const filteredListings = listings
    .filter(
      (listing) =>
        (listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         listing.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        listing.price >= priceRange.min &&
        listing.price <= priceRange.max
    )
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className="listings-container">
      <h2>🏡 Available Listings</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by title or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Sort by Price: Low to High</option>
          <option value="desc">Sort by Price: High to Low</option>
        </select>

        <div className="price-filter">
          <input
            type="number"
            placeholder="Min price"
            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Max price"
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
          />
        </div>
      </div>

      {filteredListings.map((listing) => (
        <div key={listing._id} className="listing-card">
          <h3>{listing.title}</h3>
          <p><strong>Location:</strong> {listing.location}</p>
          <p><strong>Price:</strong> €{listing.price}</p>
          <p><strong>Description:</strong> {listing.description}</p>
          <p><strong>Features:</strong> {listing.features?.join(", ") || "None listed"}</p>
          <p><em>Posted by: {listing.landlordEmail}</em></p>
        </div>
      ))}
    </div>
  );
};

export default Listings;
