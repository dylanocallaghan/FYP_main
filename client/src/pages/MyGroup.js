import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import "../styles/MyGroup.css";

const MyGroup = () => {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteUsernames, setInviteUsernames] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState(""); // ✅ for animated messages
  const token = localStorage.getItem("token");

  const fetchGroup = async () => {
    try {
      const res = await axios.get("http://localhost:5000/groups/mygroup", {
        headers: { "x-access-token": token },
      });
      setGroup(res.data);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        groupId: res.data._id
      }));
    } catch (err) {
      if (err.response?.status === 404) {
        setGroup(null);
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

  useEffect(() => {
    if (flashMessage) {
      const timeout = setTimeout(() => setFlashMessage(""), 3000);
      return () => clearTimeout(timeout);
    }
  }, [flashMessage]);

  const handleLeave = async () => {
    if (!group?._id) return;
    try {
      await axios.patch(`http://localhost:5000/groups/${group._id}/leave`, {}, {
        headers: { "x-access-token": token },
      });
      setFlashMessage("❌ You have left the group.");
      fetchGroup();
    } catch (err) {
      setFlashMessage("⚠️ Error leaving group.");
    }
  };

  const handleDelete = async () => {
    if (!group?._id) return;
    try {
      await axios.delete(`http://localhost:5000/groups/${group._id}`, {
        headers: { "x-access-token": token },
      });
      setFlashMessage("🗑 Group deleted.");
      fetchGroup();
    } catch (err) {
      setFlashMessage("❌ Error deleting group.");
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

      const { invited, notFound, alreadyInvited, alreadyMembers } = res.data;
      let message = "";

      if (invited.length > 0) message += `✅ Invites sent to: ${invited.join(", ")}\n`;
      if (alreadyInvited.length > 0) message += `ℹ️ Already invited: ${alreadyInvited.join(", ")}\n`;
      if (alreadyMembers.length > 0) message += `👥 Already in group: ${alreadyMembers.join(", ")}\n`;
      if (notFound.length > 0) message += `⚠️ Not found: ${notFound.join(", ")}\n`;

      setFlashMessage(message.trim());
      setInviteUsernames("");
      fetchGroup();
    } catch (err) {
      setFlashMessage("❌ Error sending invites.");
    }
  };

  const handleCreateGroupChat = async () => {
    try {
      await axios.post(`http://localhost:5000/groups/${group._id}/chat`, {}, {
        headers: { "x-access-token": token },
      });
      setFlashMessage("💬 Group chat created! You’ll see it in your Inbox.");
      fetchGroup();
    } catch (err) {
      setFlashMessage("❌ Failed to create group chat.");
    }
  };

  if (loading) return <div className="group-page">Loading group...</div>;
  if (!group) return <div className="group-page">You are not in a group.</div>;

  const isCreator = group.creator._id === user.id;

  return (
    <div className="group-page">
      <div className="group-header">
        <h2>👥 Your Group</h2>
        {flashMessage && <div className="chat-popup">{flashMessage}</div>}
        <div className="group-meta">
          <p><span className="meta-label">Group Name:</span> {group.name}</p>
          <p><span className="meta-label">Creator:</span> {group.creator.username}</p>
        </div>
      </div>

      <h3>✅ Members</h3>
      <ul>{group.members.map((m) => (
        <li key={m._id}>{m.username || m._id}</li>
      ))}</ul>

      {group.pendingInvites.length > 0 && (
        <>
          <h3>⏳ Pending Invites</h3>
          <ul>{group.pendingInvites.map((p) => (
            <li key={p._id}>{p.username || p._id}</li>
          ))}</ul>
        </>
      )}

      {isCreator ? (
        <div>
          <button onClick={handleDelete} className="delete">🗑 Delete Group</button>
          <button onClick={() => setShowInviteForm((prev) => !prev)} className="invite">✉ Invite Users</button>
          <button onClick={handleCreateGroupChat} className="chat">💬 Create Group Chat</button>

          {showInviteForm && (
            <div className="invite-form">
              <input
                type="text"
                value={inviteUsernames}
                onChange={(e) => setInviteUsernames(e.target.value)}
                placeholder="Enter usernames, comma-separated"
              />
              <button onClick={handleSendInvites} className="invite">Send Invites</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={handleLeave} className="leave">❌ Leave Group</button>
          {group.chatCreated && (
            <button onClick={() => window.location.href = "/inbox"} className="chat">📨 Group Chat</button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyGroup;
