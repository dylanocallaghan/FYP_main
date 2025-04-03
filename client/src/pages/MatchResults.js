import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";

export default function MatchResults() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/matches", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch matches");

        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  const startChatWithUser = async (otherUsername) => {
    const client = StreamChat.getInstance("yduz4z95nncj");
    const currentUser = localStorage.getItem("username");
  
    if (!currentUser || !otherUsername) {
      alert("Missing usernames!");
      return;
    }
  
    // ✅ Generate a consistent channel ID for both users
    const sortedMembers = [currentUser, otherUsername].sort();
    const channelId = sortedMembers.join("-");
  
    // Only connect user if not already connected
    if (!client.userID) {
      const res = await fetch("http://localhost:5000/stream/getToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentUser }),
      });
      const { token } = await res.json();
      await client.connectUser({ id: currentUser }, token);
    }
  
    const channel = client.channel("messaging", channelId, {
      members: sortedMembers,
    });
  
    await channel.watch();
    localStorage.setItem("chatChannelId", channelId);
    navigate("/chat");
  };
  

  return (
    <div style={{ padding: "2em" }}>
      <h2>Top Matches</h2>
      <ul>
        {matches
          .filter((m) => m.username) // ✅ skip undefined usernames
          .map((m) => (
            <li key={m.id}>
              <strong>{m.name}</strong> ({m.username}) – Match Score: {m.score}%
              &nbsp;
              <Link to={`/profile/${m.id}`} state={{ profile: m }}>
                View Profile
              </Link>
              &nbsp; | &nbsp;
              <button onClick={() => startChatWithUser(m.username)}>Chat</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
