import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/listings.css";

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
      if (parsedUser.groupId) {
        setGroupId(parsedUser.groupId);
      }
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
      payload.applicantId = user?._id;
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
    <div className="listings-container">
      <div className="listing-card">
        <h2>{listing.title}</h2>
        <p><strong>Location:</strong> {listing.location}</p>
        <p><strong>Price:</strong> {listing.price}</p>
        <p><strong>Description:</strong> {listing.description}</p>
        <p><strong>Features:</strong> {listing.features?.join(", ")}</p>

        {listing.images?.map((img, i) => (
          <img key={i} src={`http://localhost:5000/uploads/${img.split("\\").pop()}`} alt={`img-${i}`} />
        ))}

        <hr />

        {alreadyApplied ? (
          <p style={{ color: "green", marginTop: "1rem" }}>
            ✅ You've already applied to this listing.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {groupId && (
              <div>
                <label>
                  <input
                    type="radio"
                    value="individual"
                    checked={applyAs === "individual"}
                    onChange={(e) => setApplyAs(e.target.value)}
                  /> Apply as Individual
                </label>
                <label style={{ marginLeft: "1rem" }}>
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
              style={{ width: "100%", marginTop: "1rem" }}
              required
            />

            <button type="submit" className="apply-btn" style={{ marginTop: "1rem" }}>
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;
