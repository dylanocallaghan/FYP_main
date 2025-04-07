// CreateGroup.js
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [usernames, setUsernames] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateGroup = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Create the group with just the creator
      const createRes = await axios.post(
        "http://localhost:5000/groups",
        { name: groupName },
        { headers: { "x-access-token": token } }
      );

      const groupId = createRes.data._id;

      // Step 2: Invite other users by username
      const usernameList = usernames
        .split(",")
        .map((u) => u.trim().toLowerCase())
        .filter((u) => u && u !== user.username.toLowerCase()); // remove self

      if (usernameList.length > 0) {
        await axios.patch(
          `http://localhost:5000/groups/${groupId}/invite`,
          { usernames: usernameList },
          { headers: { "x-access-token": token } }
        );
      }

      alert("Group created and invites sent!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to create group or send invites.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Create a New Group</h2>
      <div>
        <label>Group Name:</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="My Uni Roommates"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
      </div>

      <div>
        <label>Invite Usernames (comma-separated):</label>
        <input
          type="text"
          value={usernames}
          onChange={(e) => setUsernames(e.target.value)}
          placeholder="e.g. kelli, johnny, lucas"
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
      </div>

      <button
        onClick={handleCreateGroup}
        disabled={loading || !groupName}
        style={{
          padding: "0.6rem 1.2rem",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Creating Group..." : "Create Group"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default CreateGroup;
