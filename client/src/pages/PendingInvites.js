import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import "../styles/PendingInvites.css"; // ✅ Link your local styles

const PendingInvites = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flashMessage, setFlashMessage] = useState(""); // ✅ flash msg state

  const fetchGroup = async () => {
    try {
      const res = await axios.get("http://localhost:5000/groups/mygroup", {
        headers: { "x-access-token": token },
      });
      setGroup(res.data);
    } catch (err) {
      console.error("Error fetching group:", err.response?.data || err.message);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchGroup();
  }, [token]);

  useEffect(() => {
    if (flashMessage) {
      const timeout = setTimeout(() => setFlashMessage(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [flashMessage]);

  const handleAccept = async () => {
    try {
      await axios.patch(`http://localhost:5000/groups/${group._id}/accept`, {}, {
        headers: { "x-access-token": token },
      });
      setFlashMessage("✅ Invite accepted!");
      fetchGroup();
    } catch (err) {
      setFlashMessage("❌ Error accepting invite.");
      console.error(err);
    }
  };

  const handleDecline = async () => {
    try {
      await axios.patch(`http://localhost:5000/groups/${group._id}/decline`, {}, {
        headers: { "x-access-token": token },
      });
      setFlashMessage("❌ Invite declined.");
      fetchGroup();
    } catch (err) {
      setFlashMessage("❌ Error declining invite.");
      console.error(err);
    }
  };

  if (loading) return <div className="pending-invites-container">Loading invites...</div>;
  if (!group) return <div className="pending-invites-container">You are not part of any group.</div>;

  const isPending = group.pendingInvites.some((inv) => inv._id === user.id);

  return (
    <div className="pending-invites-container">
      <h2 className="pending-invites-title">⏳ Pending Invites</h2>

      {flashMessage && <div className="chat-popup">{flashMessage}</div>}

      <h3>✅ Members</h3>
      <ul className="pending-invites-list">
        {group.members.map((m) => (
          <li key={m._id} className="pending-invites-item">
            {m.username}
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: "2rem" }}>📨 Invited:</h3>
      {group.pendingInvites.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        <ul className="pending-invites-list">
          {group.pendingInvites.map((p) => (
            <li key={p._id} className="pending-invites-item">
              {p.username}
            </li>
          ))}
        </ul>
      )}

      {isPending && (
        <div className="pending-invites-actions" style={{ marginTop: "2rem" }}>
          <p style={{ marginBottom: "1rem" }}>You have a pending invite to this group:</p>
          <button className="accept" onClick={handleAccept}>✔ Accept</button>
          <button className="decline" onClick={handleDecline}>✖ Decline</button>
        </div>
      )}
    </div>
  );
};

export default PendingInvites;
