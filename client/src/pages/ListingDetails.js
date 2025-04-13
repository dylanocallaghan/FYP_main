import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ListingDetails.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [applyAs, setApplyAs] = useState("individual");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setGroupId(parsedUser.groupId || null);
    }

    fetchListing();
  }, [id]);

  useEffect(() => {
    const checkExistingApplication = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      try {
        const res = await axios.get(`http://localhost:5000/applications/listing/${id}`, {
          headers: { "x-access-token": token }
        });

        const applications = res.data;
        const match = applications.find(app =>
          (applyAs === "group" && app.groupId?._id === groupId) ||
          (applyAs === "individual" && app.applicantId === user._id)
        );

        if (match) {
          setAlreadyApplied(true);
        }

      } catch (err) {
        console.error("Error checking application status:", err);
      }
    };

    if (user) {
      checkExistingApplication();
    }
  }, [user, id, groupId, applyAs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const payload = {
      listingId: id,
      message
    };

    if (applyAs === "group" && groupId) {
      payload.groupId = groupId;
    } else {
      payload.applicantId = user?._id || user?.id;
    }

    try {
      await axios.post("http://localhost:5000/applications", payload, {
        headers: { "x-access-token": token }
      });
      alert("Application submitted!");
      navigate("/listings");
    } catch (err) {
      console.error("Application error:", err);
      alert("Something went wrong.");
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <div className="listing-details-container">
      <div className="listing-details-card">
        <h2>{listing.title}</h2>
        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Address:</strong> {listing.address}</p>

        {listing.address && (
          <>
            <p><strong>Map Preview:</strong></p>
            <div style={{ margin: "1rem 0", borderRadius: "8px", overflow: "hidden" }}>
              <iframe
                title="map"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(listing.address)}&output=embed`}
              />
            </div>
          </>
        )}

        <p><strong>Price:</strong> €{listing.price}</p>
        <p><strong>Description:</strong> {listing.description}</p>
        <p><strong>Features:</strong> {listing.features?.join(", ")}</p>
        <p><strong>Available From:</strong> {listing.availableFrom?.slice(0, 10)}</p>
        <p><strong>Available Until:</strong> {listing.availableUntil?.slice(0, 10)}</p>
        <p><strong>Lease Length:</strong> {listing.leaseLength} months</p>
        <p><strong>Property Type:</strong> {listing.propertyType}</p>
        <p><strong>Room Type:</strong> {listing.roomType}</p>
        <p><strong>Furnishing:</strong> {listing.furnishing}</p>

        <p><strong>Bills Included:</strong></p>
        <ul>
          <li>Internet: {listing.billsIncluded?.internet ? "Yes" : "No"}</li>
          <li>Electricity: {listing.billsIncluded?.electricity ? "Yes" : "No"}</li>
          <li>Water: {listing.billsIncluded?.water ? "Yes" : "No"}</li>
        </ul>

        <p><strong>Rules:</strong></p>
        <ul>
          <li>Pets: {listing.rules?.noPets ? "Yes" : "No"}</li>
          <li>Smoking: {listing.rules?.noSmoking ? "Yes" : "No"}</li>
        </ul>

        {listing.landlordNote && (
          <p><strong>Landlord Note:</strong> {listing.landlordNote}</p>
        )}

        <p><strong>Landlord Email:</strong> {listing.landlordEmail}</p>

        {listing.images?.length > 0 && (
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            useKeyboardArrows
            autoPlay
            interval={5000}
            className="listing-carousel"
          >
            {listing.images.map((img, i) => {
              const imageURL = `http://localhost:5000/uploads/${img.split("\\").pop()}`;
              return (
                <div key={i}>
                  <img
                    src={imageURL}
                    alt={`listing-${i}`}
                    className="carousel-image"
                    onError={(e) => (e.target.src = "/default.jpg")}
                  />
                </div>
              );
            })}
          </Carousel>
        )}

        <hr />

        {alreadyApplied ? (
          <p style={{ color: "green", marginTop: "1rem" }}>
            ✅ You've already applied to this listing.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {groupId && (
              <div style={{ margin: "1rem 0" }}>
                <label>
                  <input
                    type="radio"
                    value="individual"
                    checked={applyAs === "individual"}
                    onChange={(e) => setApplyAs(e.target.value)}
                  /> Apply as Individual
                </label>
                <label style={{ marginLeft: "1.5rem" }}>
                  <input
                    type="radio"
                    value="group"
                    checked={applyAs === "group"}
                    onChange={(e) => setApplyAs(e.target.value)}
                  /> Apply as Group
                </label>
              </div>
            )}

            <textarea
              placeholder="Write a short message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />

            <button type="submit" className="apply-btn">Submit Application</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;
