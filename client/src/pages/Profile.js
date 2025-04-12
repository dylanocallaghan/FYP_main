import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="profile-container">Loading profile...</div>;

  const {
    name,
    username,
    email1,
    accountType,
    gender,
    pronouns,
    age,
    course,
    year,
    smoking,
    drinking,
    pets,
    openTo,
    bio,
    quizResponses,
    priorityOrder,
  } = profile;

  return (
    <div className="profile-container">
      <h2 className="profile-header">{username}'s Profile</h2>

      <div className="profile-section">
        <p><span className="profile-label">Username:</span> <span className="profile-value">{username}</span></p>
        <p><span className="profile-label">Email:</span> <span className="profile-value">{email1}</span></p>
        <p><span className="profile-label">Account Type:</span> <span className="profile-value">{accountType}</span></p>
        <p><span className="profile-label">Gender:</span> <span className="profile-value">{gender}</span></p>
        <p><span className="profile-label">Pronouns:</span> <span className="profile-value">{pronouns}</span></p>
        <p><span className="profile-label">Age:</span> <span className="profile-value">{age}</span></p>
        <p><span className="profile-label">Course:</span> <span className="profile-value">{course}</span></p>
        <p><span className="profile-label">Year:</span> <span className="profile-value">{year}</span></p>
        <p><span className="profile-label">Smoker:</span> <span className="profile-value">{smoking}</span></p>
        <p><span className="profile-label">Drinks Alcohol:</span> <span className="profile-value">{drinking}</span></p>
        <p><span className="profile-label">Has Pets:</span> <span className="profile-value">{pets}</span></p>
      </div>

      <div className="profile-section">
        <p><strong>Open To:</strong></p>
        <ul className="quiz-list">
          {openTo?.smokers && <li>Living with smokers</li>}
          {openTo?.petOwners && <li>Pet owners</li>}
          {openTo?.mixedGender && <li>Mixed gender</li>}
          {openTo?.internationalStudents && <li>International students</li>}
        </ul>
      </div>

      <div className="profile-section">
        <p><strong>Bio</strong><br />{bio || "No bio provided."}</p>
      </div>

      {quizResponses && priorityOrder && (
        <div className="quiz-section">
          <h3 className="quiz-title">🧠 Roommate Quiz Responses</h3>
          <ul className="quiz-list">
            {priorityOrder.map((key, index) => (
              <li key={key} className="quiz-item">
                <strong>{key} (Priority {index + 1}):</strong> {quizResponses[key]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="quiz-card">
        {quizResponses && Object.keys(quizResponses).length > 0 ? (
          <>
            <span>💡 <strong>Want to update your matches?</strong></span>
            <button onClick={() => navigate("/compatibility-quiz")}>Edit Quiz</button>
          </>
        ) : (
          <>
            <span>💡 <strong>Want better roommate matches?</strong></span>
            <button onClick={() => navigate("/compatibility-quiz")}>Take Quiz</button>
          </>
        )}
      </div>
    </div>
  );
}
