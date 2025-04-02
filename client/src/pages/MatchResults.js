// client/src/pages/MatchResults.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MatchResults() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/matches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: "2em" }}>
      <h2>Top Matches</h2>
      <ul>
        {matches.map((m) => (
          <li key={m._id}>
            <strong>{m.name}</strong> ({m.email}) – Match Score: {m.score}%
            &nbsp;
            <Link to={`/profile/${m._id}`} state={{ profile: m }}>
              View Profile
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
