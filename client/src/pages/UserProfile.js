import { useLocation, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  if (!profile) {
    return <div style={{ padding: "2rem" }}>Profile not found.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{profile.name}'s Profile</h2>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>

      <h3>Roommate Quiz Responses</h3>
      <ul>
        {Object.entries(profile.quizResponses || {}).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "5px",
          background: "#f0f0f0",
          cursor: "pointer",
        }}
      >
        🔙 Go Back
      </button>
    </div>
  );
}
