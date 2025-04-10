import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/stats", {
          headers: { "x-access-token": token },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`http://localhost:5000/listings/${id}`, {
        headers: { "x-access-token": token },
      });
      setStats((prev) => ({
        ...prev,
        recentListings: prev.recentListings.filter((l) => l._id !== id),
      }));
    } catch (err) {
      alert("Failed to delete listing.");
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`http://localhost:5000/messages/${id}`, {
        headers: { "x-access-token": token },
      });
      setStats((prev) => ({
        ...prev,
        recentMessages: prev.recentMessages.filter((m) => m._id !== id),
        totalMessages: prev.totalMessages - 1,
      }));
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { "x-access-token": token },
      });
      setStats((prev) => ({
        ...prev,
        recentUsers: prev.recentUsers.filter((u) => u._id !== id),
        totalUsers: prev.totalUsers - 1,
      }));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading admin dashboard...</div>;
  if (!stats) return <div style={{ padding: "2rem" }}>Failed to load data.</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛠 Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "1rem" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3>📊 Stats</h3>
          <ul>
            <li><strong>Total Users:</strong> {stats.totalUsers}</li>
            <li><strong>Total Listings:</strong> {stats.totalListings}</li>
            <li><strong>Total Messages:</strong> {stats.totalMessages}</li>
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3>🆕 Recent Listings</h3>
          <ul>
            {stats.recentListings.map((listing) => (
              <li key={listing._id}>
                {listing.title || "Untitled Listing"}
                <button 
                  onClick={() => handleDeleteListing(listing._id)}
                  style={{ marginLeft: "1rem", color: "red", cursor: "pointer" }}>
                  🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3>💬 Recent Messages</h3>
          <ul>
            {stats.recentMessages.map((msg) => (
              <li key={msg._id}>
                {msg.message || "[No Content]"}
                <button 
                  onClick={() => handleDeleteMessage(msg._id)}
                  style={{ marginLeft: "1rem", color: "red", cursor: "pointer" }}>
                  🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3>👥 Recent Users</h3>
          <ul>
            {(stats.recentUsers || []).map((user) => (
              <li key={user._id}>
                {user.username} ({user.email})
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  style={{ marginLeft: "1rem", color: "red", cursor: "pointer" }}>
                  🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
