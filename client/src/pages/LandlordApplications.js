import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/LandlordApplications.css';

  // State for storing apps, filters, lookups, chat feedback
const LandlordApplications = () => {
  const { user, streamClient } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [sortBy, setSortBy] = useState("date");
  const [usernamesMap, setUsernamesMap] = useState({});
  const [listingNamesMap, setListingNamesMap] = useState({});
  const [chatMessage, setChatMessage] = useState("");

    //  Fetch all landlord applications and extract needed usernames + listing titles
  useEffect(() => {
    if (!token) return;

    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/applications/landlord", {
          headers: { "x-access-token": token },
        });

        setApplications(res.data);

        const userIds = new Set();
        const listingIds = new Set();

        res.data.forEach(app => {
          listingIds.add(app.listingId);
          if (app.groupId?.members?.length) {
            app.groupId.members.forEach(m => {
              const id = typeof m === "object" ? m._id : m;
              if (id) userIds.add(id);
            });
          
            app.groupId.pendingInvites?.forEach(i => {
              const id = typeof i === "object" ? i._id : i;
              if (id) userIds.add(id);
            });
          
            const creatorId = typeof app.groupId.creator === "object" ? app.groupId.creator._id : app.groupId.creator;
            if (creatorId) userIds.add(creatorId);
          } else if (app.applicantId) {
            const applicantId = typeof app.applicantId === "object" ? app.applicantId._id : app.applicantId;
            if (applicantId) userIds.add(applicantId);
          }
          
        });

          //  Fetch all usernames by ID

        const userMap = {};
        await Promise.all([...userIds].map(async id => {
          try {
            const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
            userMap[id] = res.data.username;
          } catch {}
        }));
        setUsernamesMap(userMap);

        const listingMap = {};
        await Promise.all([...listingIds].map(async id => {
          try {
            const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
            listingMap[id] = res.data.title;
          } catch {}
        }));
        setListingNamesMap(listingMap);
      } catch (err) {
        console.error("Error fetching applications:", err.response?.data || err.message);
      }
    };

    fetchApplications();
  }, [token]);

  // Filter and sort logic for display
  useEffect(() => {
    let filtered = [...applications];

    if (filterStatus !== "all") {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === "listing") {
      filtered.sort((a, b) => {
        const nameA = listingNamesMap[a.listingId]?.toLowerCase() || "";
        const nameB = listingNamesMap[b.listingId]?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      });
    }

    setFilteredApps(filtered);
  }, [applications, filterStatus, sortOrder, sortBy, listingNamesMap]);

    // Update application status (approve/reject)
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

    // Create a new chat with applicant (group or individual)

  const handleCreateChat = async (app) => {
    if (!streamClient || !user) return;
  
    const landlordUsername = user.username;
    const members = new Set([landlordUsername]);
  
    try {
      let usernames = [];
  
      if (app.groupId?.members?.length) {
        const resolved = await Promise.all(
          app.groupId.members.map(async (m) => {
            const id = typeof m === "object" ? m._id : m;
            const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
            return res.data.username;
          })
        );
        usernames = resolved.filter(Boolean); // remove any nulls
        usernames.forEach((u) => members.add(u));
      } else if (app.applicantId) {
        const id = typeof app.applicantId === "object" ? app.applicantId._id : app.applicantId;
        const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
        members.add(res.data.username);
      }
  
      const memberArray = Array.from(members);
      const channelId = `chat-${app._id}`;
  
      // ✅ Check if chat already exists
      const existingChannels = await streamClient.queryChannels({ id: { $eq: channelId } });
      if (existingChannels.length > 0) {
        setChatMessage("💬 Chat already exists for this application.");
        setTimeout(() => setChatMessage(""), 3000); // Hide after 3s
        return;
      }
      
  
      const channel = streamClient.channel("messaging", channelId, {
        name: `Application Chat - ${app._id}`,
        members: memberArray,
      });
  
      await channel.create();
      navigate("/inbox");
    } catch (err) {
      console.error("Failed to create or fetch chat:", err);
      alert("Chat could not be created.");
    }
  };
  
  

  const handleDeleteApplication = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/applications/${id}`, {
        headers: { "x-access-token": token },
      });
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application.");
    }
  };

  const handleViewProfile = (app) => {
    let userId = null;
  
    if (app.applicantId) {
      userId = typeof app.applicantId === "object" ? app.applicantId._id : app.applicantId;
    } else if (app.groupId?.creator) {
      userId = typeof app.groupId.creator === "object" ? app.groupId.creator._id : app.groupId.creator;
    }
  
    if (!userId) {
      alert("User profile not found.");
      return;
    }
  
    navigate(`/user-profile/${userId}`);
    console.log("Navigating to user profile with ID:", userId);
  };


  return (
    <div className="applications-page">
      <h2>Applications to Your Listings</h2>

      {chatMessage && <div className="chat-popup">{chatMessage}</div>}   {/* 👈 Move this here */}

      <div className="filter-controls">
        <label>Status:
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label>Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="listing">Listing Name</option>
          </select>
        </label>

        {sortBy === "date" && (
          <label>Order:
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </label>
        )}
      </div>

      {filteredApps.length === 0 ? (
        <p className="no-applications">No applications found.</p>
      ) : (
        <ul className="applications-list">
          {filteredApps.map(app => (
            <li key={app._id} className="application-card">
              <p><strong>Message:</strong> {app.message}</p>
              <p><strong>Status:</strong> <span className={`status ${app.status}`}>{app.status}</span></p>
              <p><strong>Listing:</strong> {listingNamesMap[app.listingId] || app.listingId}</p>
              <p><strong>Lease Length:</strong> {app.leaseLength ? `${app.leaseLength} months` : "N/A"}</p>



              {app.groupId ? (
                <div className="application-group-info">
                  <p><strong>Group ID:</strong> {app.groupId._id}</p>
                  <p><strong>Creator:</strong> {usernamesMap[app.groupId.creator]}</p>
                  <p><strong>Members:</strong> {app.groupId.members?.map(id => usernamesMap[id]).join(", ")}</p>
                  <p><strong>Pending Invites:</strong> {app.groupId.pendingInvites?.map(id => usernamesMap[id]).join(", ")}</p>
                </div>
              ) : app.applicantId ? (
                <p><strong>Applicant:</strong> {usernamesMap[typeof app.applicantId === "object" ? app.applicantId._id : app.applicantId]}</p>
              ) : null}

              <div className="application-actions">
                <button onClick={() => handleStatusUpdate(app._id, "approved")} className="approve-btn">Approve</button>
                <button onClick={() => handleStatusUpdate(app._id, "rejected")} className="reject-btn">Reject</button>
                <button onClick={() => handleCreateChat(app)} className="chat-btn">Chat</button>
                <button onClick={() => handleViewProfile(app)} className="profile-btn">View Profile</button>
                <button onClick={() => handleDeleteApplication(app._id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LandlordApplications;



