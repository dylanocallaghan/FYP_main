import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

const MyGroup = () => {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteUsernames, setInviteUsernames] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const token = localStorage.getItem("token");

  const fetchGroup = async () => {
    try {
      const res = await axios.get("http://localhost:5000/groups/mygroup", {
        headers: { "x-access-token": token },
      });
      setGroup(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setGroup(null); // Expected: not in a group
      } else {
        console.error("Error fetching group:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const handleLeave = async () => {
    if (!group?._id) return;
    try {
      await axios.patch(`http://localhost:5000/groups/${group._id}/leave`, {}, {
        headers: { "x-access-token": token },
      });
      alert("You have left the group.");
      fetchGroup();
    } catch (err) {
      alert("Error leaving group.");
    }
  };

  const handleDelete = async () => {
    if (!group?._id) return;
    try {
      await axios.delete(`http://localhost:5000/groups/${group._id}`, {
        headers: { "x-access-token": token },
      });
      alert("Group deleted.");
      fetchGroup();
    } catch (err) {
      alert("Error deleting group.");
    }
  };

  const handleSendInvites = async () => {
    if (!inviteUsernames || !group?._id) return;
  
    const usernames = inviteUsernames.split(",").map((u) => u.trim());
  
    try {
      const res = await axios.patch(
        `http://localhost:5000/groups/${group._id}/invite`,
        { usernames },
        { headers: { "x-access-token": token } }
      );
  
      const {
        invited,
        notFound,
        alreadyInvited,
        alreadyMembers,
      } = res.data;
  
      if (invited.length > 0) {
        alert(`✅ Invites sent to: ${invited.join(", ")}`);
      }
  
      if (alreadyInvited.length > 0) {
        alert(`ℹ️ Already invited: ${alreadyInvited.join(", ")}`);
      }
  
      if (alreadyMembers.length > 0) {
        alert(`👥 Already in group: ${alreadyMembers.join(", ")}`);
      }
  
      if (notFound.length > 0) {
        alert(`⚠️ Not found: ${notFound.join(", ")}`);
      }
  
      setInviteUsernames("");
      fetchGroup(); // Refresh data
    } catch (err) {
      alert("❌ Error sending invites.");
      console.error(err);
    }
  };
  
  
  

  if (loading) return <div className="group-page">Loading group...</div>;

  if (!group) return <div className="group-page">You are not in a group.</div>;

  const isCreator = group.creator._id === user.id;

  return (
    <div className="group-page">
      <h2>👥 Your Group</h2>
      <p>
        <strong>Creator:</strong> {group.creator.username}
      </p>

      <h3>✅ Members</h3>
      <ul>
        {group.members.map((m) => (
          <li key={m._id}>{m.username || m._id}</li>
        ))}
      </ul>

      {group.pendingInvites.length > 0 && (
        <>
          <h3>⏳ Pending Invites</h3>
          <ul>
            {group.pendingInvites.map((p) => (
              <li key={p._id}>{p.username || p._id}</li>
            ))}
          </ul>
        </>
      )}

      {isCreator ? (
        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              marginRight: "1rem",
              cursor: "pointer",
            }}
          >
            🗑 Delete Group
          </button>

          <button
            onClick={() => setShowInviteForm((prev) => !prev)}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ✉ Invite Users
          </button>

          {showInviteForm && (
            <div style={{ marginTop: "1rem" }}>
              <input
                type="text"
                value={inviteUsernames}
                onChange={(e) => setInviteUsernames(e.target.value)}
                placeholder="Enter usernames, comma-separated"
                style={{ padding: "0.5rem", width: "300px" }}
              />
              <button
                onClick={handleSendInvites}
                style={{
                  marginLeft: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Send Invites
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLeave}
          style={{
            marginTop: "2rem",
            backgroundColor: "#fdd835",
            color: "#000",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ❌ Leave Group
        </button>
      )}
    </div>
  );
};

export default MyGroup;
