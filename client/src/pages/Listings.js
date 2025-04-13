import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/listings.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [smokerFriendlyOnly, setSmokerFriendlyOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings");
        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="listings-container">
      <h2>🏡 Available Listings</h2>

      <div className="filter-sort-bar">
        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

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

      <div className="listing-grid">
        {listings
          .filter((listing) =>
            listing.location.toLowerCase().includes(locationFilter.toLowerCase())
          )
          .filter((listing) => (petFriendlyOnly ? listing.rules?.noPets === true : true))
          .filter((listing) => (smokerFriendlyOnly ? listing.rules?.noSmoking === true : true))
          .sort((a, b) => {
            if (priceSort === "low") return a.price - b.price;
            if (priceSort === "high") return b.price - a.price;
            return 0;
          })
          .map((listing) => (
            <div key={listing._id} className="listing-card">
              <h3>{listing.title}</h3>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Price:</strong> {listing.price}</p>
              <p><strong>Description:</strong> {listing.description}</p>
              <p><strong>Features:</strong> {listing.features.join(", ")}</p>
              <p><strong>Posted by:</strong> {listing.landlordEmail}</p>

              {listing.images && listing.images.length > 0 && (
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  autoPlay
                  interval={5000}
                  useKeyboardArrows
                  className="listing-carousel"
                >
                  {listing.images.map((image, index) => {
                    const imageURL = `http://localhost:5000/uploads/${image.split("\\").pop()}`;
                    return (
                      <div key={index}>
                        <img
                          src={imageURL}
                          alt={`listing-${index}`}
                          onError={(e) => (e.target.src = "/default.jpg")}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              )}

              <button onClick={() => navigate(`/listing/${listing._id}`)}>
                View & Apply
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
