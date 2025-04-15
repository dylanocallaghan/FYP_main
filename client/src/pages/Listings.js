import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/listings.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [leaseFilter, setLeaseFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [furnishingFilter, setFurnishingFilter] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [smokerFriendlyOnly, setSmokerFriendlyOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true); // open by default

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/listings")
      .then(res => setListings(res.data))
      .catch(err => console.error("Error fetching listings:", err));
  }, []);

  const filteredListings = listings.filter(listing => {
    const locationMatch = listing.location.toLowerCase().includes(locationFilter.toLowerCase());
    const leaseMatch = leaseFilter === "" || Number(listing.leaseLength) === Number(leaseFilter);
    const roomTypeMatch = roomTypeFilter === "" || listing.roomType === roomTypeFilter;
    const furnishingMatch = furnishingFilter === "" || listing.furnishing === furnishingFilter;
    const propertyTypeMatch = propertyTypeFilter === "" || listing.propertyType === propertyTypeFilter;
    const petMatch = !petFriendlyOnly || listing.petFriendly === true;
    const smokerMatch = !smokerFriendlyOnly || listing.smokerFriendly === true;
    return locationMatch && leaseMatch && roomTypeMatch && furnishingMatch && propertyTypeMatch && petMatch && smokerMatch;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (priceSort === "low") return a.price - b.price;
    if (priceSort === "high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="listings-container">
      <h2 className="listings-title">🏡 Available Listings</h2>

      <div className={`filter-box ${filtersOpen ? "open" : ""}`}>
        <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
          {filtersOpen ? "Hide Filters ▲" : "Show Filters ▼"}
        </button>

        {filtersOpen && (
          <div className="filter-sort-bar">
            <input
              type="text"
              placeholder="Search by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            <select value={leaseFilter} onChange={(e) => setLeaseFilter(e.target.value)}>
              <option value="">All Lease Lengths</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="9">9 months</option>
              <option value="12">12 months</option>
            </select>

            <select value={roomTypeFilter} onChange={(e) => setRoomTypeFilter(e.target.value)}>
              <option value="">All Room Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="entire">Entire</option>
            </select>

            <select value={furnishingFilter} onChange={(e) => setFurnishingFilter(e.target.value)}>
              <option value="">All Furnishing</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>

            <select value={propertyTypeFilter} onChange={(e) => setPropertyTypeFilter(e.target.value)}>
              <option value="">All Property Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
            </select>

            <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
              <option value="">Sort by Price</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={petFriendlyOnly}
                onChange={(e) => setPetFriendlyOnly(e.target.checked)}
              />
              Pet Friendly Only
            </label>

            <label>
              <input
                type="checkbox"
                checked={smokerFriendlyOnly}
                onChange={(e) => setSmokerFriendlyOnly(e.target.checked)}
              />
              Smoker Friendly Only
            </label>
          </div>
        )}
      </div>

      <div className="listing-cards">
        {sortedListings.map((listing) => (
          <div key={listing._id} className="listing-card">
            <h3>{listing.title}</h3>
            <p><strong>Location:</strong> {listing.location}</p>
            <p><strong>Price:</strong> €{listing.price}</p>
            <p><strong>Description:</strong> {listing.description}</p>
            <p><strong>Lease Length:</strong> {listing.leaseLength} months</p>
            <p><strong>Room Type:</strong> {listing.roomType}</p>
            <p><strong>Furnishing:</strong> {listing.furnishing}</p>
            <p><strong>Property Type:</strong> {listing.propertyType}</p>
            <p><strong>Features:</strong> {listing.features}</p>
            <p><strong>Posted by:</strong> {listing.landlordEmail}</p>

            <Carousel autoPlay interval={5000} useKeyboardArrows className="listing-carousel">
              {listing.images.map((image, index) => {
                const imageURL = `http://localhost:5000/uploads/${image}`;
                return (
                  <div key={index}>
                    <img
                      src={imageURL}
                      alt={`listing-${index}`}
                      onError={(e) => (e.target.src = "/fallback.png")}
                    />
                  </div>
                );
              })}
            </Carousel>

            <button onClick={() => navigate(`/listing/${listing._id}`)}>
              View & Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
