import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import "../styles/MatchResults.css";

export default function MatchResults() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/match/compatible-users", {
          headers: { Authorization: `Bearer ${token}` },
        });

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
    if (!currentUser || !otherUsername) return;

    const sortedMembers = [currentUser, otherUsername].sort();
    const channelId = sortedMembers.join("-");

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
    navigate("/inbox");
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "green";
    if (score >= 50) return "orange";
    return "red";
  };

  return (
    <div className="match-results-container">
      <h2>Top 5 Matches</h2>
      <p className="match-subtitle">
        Based on your quiz answers and priority rankings. Higher % = more compatible living habits.
      </p>

      <ul className="match-list">
        {matches.slice(0, 5).map((m) => (
          <li key={m.userId} className="match-item">
            <div>
              <strong>{m.name}</strong> ({m.username}) –{" "}
              <span className="match-score" style={{ color: getScoreColor(m.score) }}>
                {m.score}% compatible
              </span>
              <div className="match-actions" style={{ marginTop: "5px" }}>
              <Link
                to={`/user-profile/${m.userId}`}
                state={{ profile: m }}
                className="view-profile-link"
              >
                View Profile
              </Link>
                <button
                  className="chat-button"
                  onClick={(e) => {
                    e.stopPropagation(); // stop click bubbling
                    startChatWithUser(m.username);
                  }}
                >
                  Chat
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
