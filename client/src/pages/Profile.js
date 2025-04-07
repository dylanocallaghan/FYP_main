import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Fetched user data:", data);
        setUser(data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h3>Roommate Quiz Responses</h3>
      <ul>
        {Object.entries(user.quizResponses || {}).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/create-group")}
        style={{
          marginTop: "1.5rem",
          padding: "0.6rem 1.2rem",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ➕ Create a Group
      </button>
    </div>
  );
}
