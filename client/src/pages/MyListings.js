import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/listings.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [approvedApps, setApprovedApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, approvedAppRes] = await Promise.all([
          axios.get("http://localhost:5000/api/listings/owner", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/applications/approved/by-owner", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setListings(listingRes.data);
        setApprovedApps(approvedAppRes.data);
      } catch (err) {
        console.error("Error fetching listings or apps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Delete listing function
  const deleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/listings/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Error deleting listing.");
    }
  };

  if (loading) return <p>Loading your listings...</p>;

  // Check if owner has approved
  const isFilled = (listingId) => {
    return approvedApps.some(
      (a) => a.listingId === listingId || a.listingId?._id === listingId
    );
  };

  // get length of aggreement 
  const getLeaseInfo = (listingId) => {
    const app = approvedApps.find(
      (a) => a.listingId === listingId || a.listingId?._id === listingId
    );
    return app ? `${app.leaseLength} month lease` : null;
  };

  // Filter options for listing owner
  const filteredListings = listings.filter((listing) => {
    if (filter === "filled") return isFilled(listing._id);
    if (filter === "unfilled") return !isFilled(listing._id);
    return true;
  });

  return (
    <div className="listings-container">
      <h2>📋 My Listings</h2>

      {/* 🔍 Styled Filter Dropdown */}
      <div className="filter-bar">
        <label htmlFor="filter">Show:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Listings</option>
          <option value="filled">Filled Listings</option>
          <option value="unfilled">Unfilled Listings</option>
        </select>
      </div>

      <div className="listing-cards">
        {filteredListings.map((listing) => {
          const leaseText = getLeaseInfo(listing._id);

          return (
            <div key={listing._id} className="listing-card">
              <h3>{listing.title}</h3>
              <p><strong>Location:</strong> {listing.location}</p>
              <p><strong>Price:</strong> €{listing.price}</p>
              <p><strong>Description:</strong> {listing.description}</p>
              <p><strong>Features:</strong> {listing.features.join(", ")}</p>
              <p><strong>Posted by:</strong> {listing.landlordEmail}</p>

              {listing.images?.length > 0 && (
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  infiniteLoop
                  autoPlay
                  interval={5000}
                  useKeyboardArrows
                  className="listing-carousel"
                >
                  {listing.images.map((img, i) => {
                    const url = `http://localhost:5000/uploads/${img.split("\\").pop()}`;
                    return (
                      <div key={i}>
                        <img
                          src={url}
                          alt={`listing-${i}`}
                          onError={(e) => (e.target.src = "/default.jpg")}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              )}

              {leaseText && (
                <p className="filled-text">✅ Filled — {leaseText}</p>
              )}

              <button onClick={() => deleteListing(listing._id)} className="delete-btn">
                🗑 Delete Listing
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
