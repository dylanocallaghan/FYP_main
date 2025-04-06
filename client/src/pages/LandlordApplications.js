import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import '../styles/LandlordApplications.css';

const LandlordApplications = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/applications/landlord", {
          headers: { "x-access-token": token },
        });

        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err.response?.data || err.message);
      }
    };

    fetchApplications();
  }, [token]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/applications/${id}/status`, { status }, {
        headers: { "x-access-token": token },
      });

      setApplications(prev =>
        prev.map(app => app._id === id ? { ...app, status } : app)
      );
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
    }
  };

  return (
    <div className="applications-page">
      <h2>Applications to Your Listings</h2>

      {applications.length === 0 ? (
        <p className="no-applications">No applications submitted yet.</p>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app._id} className="application-card">
              <p><strong>Message:</strong> {app.message}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>Listing ID:</strong> {app.listingId}</p>

              {app.groupId && (
                <div className="application-group-info">
                  <p><strong>Group ID:</strong> {app.groupId._id}</p>
                  <p><strong>Creator:</strong> {app.groupId.creator}</p>
                  <p><strong>Members:</strong> {app.groupId.members?.join(", ")}</p>
                  <p><strong>Pending Invites:</strong> {app.groupId.pendingInvites?.join(", ")}</p>
                </div>
              )}

              <div className="application-actions">
                <button
                  onClick={() => handleStatusUpdate(app._id, "approved")}
                  className="approve-btn"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(app._id, "rejected")}
                  className="reject-btn"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LandlordApplications;
