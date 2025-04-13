// UserProfile.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/user/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    if (id) fetchProfile();
  }, [id]);

  if (!profile) return <div className="profile-container">Loading profile...</div>;

  const {
    name,
    username,
    email,
    accountType,
    quizResponses,
    priorityOrder,
    gender,
    pronouns,
    age,
    course,
    year,
    smoking,
    drinking,
    pets,
    openTo,
    bio
  } = profile;

  return (
    <div className="profile-container">
      <div className="profile-header">{username}'s Profile</div>
      <div className="profile-flex">
        <div className="profile-left">
          <div className="profile-section"><span className="profile-label">Username:</span><span className="profile-value">{username}</span></div>
          <div className="profile-section"><span className="profile-label">Email:</span><span className="profile-value">{email}</span></div>
          <div className="profile-section"><span className="profile-label">Account Type:</span><span className="profile-value">{accountType}</span></div>
          <div className="profile-section"><span className="profile-label">Gender:</span><span className="profile-value">{gender}</span></div>
          <div className="profile-section"><span className="profile-label">Pronouns:</span><span className="profile-value">{pronouns}</span></div>
          <div className="profile-section"><span className="profile-label">Age:</span><span className="profile-value">{age}</span></div>
          <div className="profile-section"><span className="profile-label">Course:</span><span className="profile-value">{course}</span></div>
          <div className="profile-section"><span className="profile-label">Year:</span><span className="profile-value">{year}</span></div>
          <div className="profile-section"><span className="profile-label">Smoker:</span><span className="profile-value">{smoking}</span></div>
          <div className="profile-section"><span className="profile-label">Drinks Alcohol:</span><span className="profile-value">{drinking}</span></div>
          <div className="profile-section"><span className="profile-label">Has Pets:</span><span className="profile-value">{pets}</span></div>
          <div className="profile-section">
            <span className="profile-label">Open To:</span>
            <ul>
              {openTo?.smokers && <li className="profile-value">Living with smokers</li>}
              {openTo?.petOwners && <li className="profile-value">Living with pet owners</li>}
              {openTo?.mixedGender && <li className="profile-value">Mixed-gender households</li>}
              {openTo?.internationalStudents && <li className="profile-value">International students</li>}
            </ul>
          </div>
          {bio && (
            <div className="profile-section">
              <span className="profile-label">Bio:</span><span className="profile-value">{bio}</span>
            </div>
          )}
        </div>

        <div className="profile-right">
          <div className="quiz-section">
            <div className="quiz-title">🧠 Roommate Quiz Responses</div>
            <ul className="quiz-list">
              {priorityOrder?.length > 0 ? (
                priorityOrder.map((key, i) => (
                  <li key={key} className="quiz-item">
                    <strong>{key} (Priority {i + 1}):</strong> {quizResponses?.[key]}
                  </li>
                ))
              ) : (
                <p>No quiz data available.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}
