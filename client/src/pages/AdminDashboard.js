import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [confirm, setConfirm] = useState(null); // { id, type }
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const token = localStorage.getItem("token");
  const headers = { "x-access-token": token };

  useEffect(() => {
    const fetchData = async () => {
      const [userRes, listingRes, appRes] = await Promise.all([
        axios.get("http://localhost:5000/admin/users", { headers }),
        axios.get("http://localhost:5000/admin/listings", { headers }),
        axios.get("http://localhost:5000/admin/applications", { headers }),
      ]);
      setUsers(userRes.data);
      setListings(listingRes.data);
      setApplications(appRes.data);
    };
    fetchData();
  }, []);

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNoteChange = async (id, note) => {
    try {
      await axios.patch(`http://localhost:5000/admin/users/${id}/note`, { note }, { headers });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, adminNote: note } : u)));
    } catch {
      alert("Failed to save note");
    }
  };

  const confirmDelete = (type, id) => setConfirm({ type, id });
  const cancelDelete = () => setConfirm(null);

  const handleConfirmDelete = async () => {
    if (!confirm) return;
    const { type, id } = confirm;

    try {
      await axios.delete(`http://localhost:5000/admin/${type}s/${id}`, { headers });
      if (type === "user") setUsers((prev) => prev.filter((u) => u._id !== id));
      if (type === "listing") setListings((prev) => prev.filter((l) => l._id !== id));
      if (type === "application") setApplications((prev) => prev.filter((a) => a._id !== id));
      setConfirm(null);
    } catch {
      alert(`Failed to delete ${type}`);
    }
  };

  const getUserApps = (userId) =>
    applications.filter((a) => a.applicantId?._id === userId);

  const getUserListings = (email) =>
    listings.filter((l) => l.landlordEmail === email);

  const getApprovedForListing = (listingId) =>
    applications.find((a) => a.listingId === listingId && a.status === "approved");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ||
      (filterType === "student" && u.accountType === "student") ||
      (filterType === "landlord" && u.accountType === "listing owner");

    return matchesSearch && matchesType;
  });

  return (
    <div className="admin-page">
      <h2 className="admin-title">🧑‍💼 Admin Dashboard</h2>

      <div className="admin-filters">
        <input
          type="text"
          className="admin-search"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="admin-dropdown"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Accounts</option>
          <option value="student">Students Only</option>
          <option value="landlord">Listing Owners Only</option>
        </select>
      </div>

      {filteredUsers.map((u) => (
        <div key={u._id} className="admin-card">
          <h3>{u.username} ({u.email}) — {u.accountType}</h3>
          <p>Applications: {u.applicationCount} | Listings: {u.listingCount} | Group: {u.groupStatus}</p>

          <textarea
            placeholder="Admin note"
            value={u.adminNote || ""}
            onChange={(e) => handleNoteChange(u._id, e.target.value)}
          />

          <div className="admin-actions">
            {u.accountType === "student" && (
              <button onClick={() => toggleExpanded(`apps-${u._id}`)}>View Applications</button>
            )}
            {u.accountType === "listing owner" && (
              <button onClick={() => toggleExpanded(`listings-${u._id}`)}>View Listings</button>
            )}
            {u.accountType === "admin" && (
              <>
                <button onClick={() => toggleExpanded(`apps-${u._id}`)}>View Applications</button>
                <button onClick={() => toggleExpanded(`listings-${u._id}`)}>View Listings</button>
              </>
            )}
            <button onClick={() => confirmDelete("user", u._id)} className="delete-btn">
              ❌ Delete User
            </button>
          </div>

          {expanded[`apps-${u._id}`] && (
            <div className="nested-section">
              <h4>📄 Applications:</h4>
              {getUserApps(u._id).length === 0 ? (
                <p>No applications submitted.</p>
              ) : (
                getUserApps(u._id).map((a) => (
                  <div key={a._id} className="listing-box">
                    <p>
                      • {a.listingId?.title || "Unknown Listing"} <br />
                      Message: {a.message} <br />
                      Status: <strong>{a.status}</strong>
                    </p>
                    <button onClick={() => confirmDelete("application", a._id)} className="delete-btn">
                      Delete Application
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {expanded[`listings-${u._id}`] && (
            <div className="nested-section">
              <h4>🏠 Listings:</h4>
              {getUserListings(u.email).length === 0 ? (
                <p>No listings created.</p>
              ) : (
                getUserListings(u.email).map((l) => {
                  const approved = getApprovedForListing(l._id);
                  return (
                    <div key={l._id} className="listing-box">
                      <p>
                        <strong>{l.title}</strong> — {l.city} ({l.roomType})<br />
                        {approved ? (
                          <span>✔️ Filled by <strong>{approved.applicantId?.username || "Group"}</strong> for {approved.leaseLength} months</span>
                        ) : (
                          <span>❌ No approved application</span>
                        )}
                      </p>
                      <button onClick={() => confirmDelete("listing", l._id)} className="delete-btn">
                        Delete Listing
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ))}

      {confirm && (
        <div className="confirm-wrapper">
          <div className="chat-popup confirm-popup">
            <p>Are you sure you want to delete this {confirm.type}?</p>
            <div>
              <button onClick={handleConfirmDelete} className="confirm-btn">Yes, Delete</button>
              <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
