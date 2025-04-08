import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const PendingInvites = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleAccept = async () => {
    try {
      await axios.patch(`http://localhost:5000/groups/${group._id}/accept`, {}, {
        headers: { "x-access-token": token },
      });
      alert("✅ Invite accepted!");
      fetchGroup(); // Refresh UI
    } catch (err) {
      console.error("Error accepting invite:", err.response?.data || err.message);
      alert("❌ Error accepting invite.");
    }
  };
  
  const handleDecline = async () => {
    try {
      await axios.patch(`http://localhost:5000/groups/${group._id}/decline`, {}, {
        headers: { "x-access-token": token },
      });
      alert("❌ Invite declined.");
      fetchGroup(); // Refresh UI
    } catch (err) {
      console.error("Error declining invite:", err.response?.data || err.message);
      alert("❌ Error declining invite.");
    }
  };


  if (loading) return <div className="group-page">Loading invites...</div>;
  if (!group) return <div className="group-page">You are not part of any group.</div>;

  const isPending = group.pendingInvites.some((inv) => inv._id === user.id);

  return (
    <div className="group-page">
      <h2>Your Group</h2>
      <p><strong>Creator:</strong> {group.creator?.username}</p>

      <h3>Members:</h3>
      <ul>
        {group.members.map((member) => (
          <li key={member._id}>{member.username}</li>
        ))}
      </ul>

      <h3>Pending Invites:</h3>
      {group.pendingInvites.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        <ul>
          {group.pendingInvites.map((invite) => (
            <li key={invite._id}>{invite.username}</li>
          ))}
        </ul>
      )}

      {isPending && (
        <div className="invite-actions" style={{ marginTop: "1rem" }}>
          <p style={{ color: "orange" }}>You have a pending invite to this group.</p>
          <button onClick={handleAccept} style={{ marginRight: "1rem", padding: "0.5rem", cursor: "pointer" }}>
            ✅ Accept
          </button>
          <button onClick={handleDecline} style={{ padding: "0.5rem", cursor: "pointer" }}>
            ❌ Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingInvites;
