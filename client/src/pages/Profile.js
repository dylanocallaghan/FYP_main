import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../styles/Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch profile from localstorage info
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

  if (!profile) return <div className="profile-container">{t("loadingProfile")}</div>;

  // fetch this info
  const {
    username,
    email,
    accountType,
    bio,
    gender,
    pronouns,
    age,
    course,
    year,
    smoking,
    drinking,
    pets,
    openTo,
    quizResponses,
    priorityOrder,
  } = profile;

  const isLandlord = accountType === "listing owner";

  return (
    <div className="profile-container">
      <h2 className="profile-header">{username} {t("profileTitle")}</h2>

      <div className="profile-flex">
        {/* LEFT COLUMN: Profile Info */}
        <div className="profile-left">
          <div className="profile-section">
            <p><span className="profile-label">{t("username")}:</span> <span className="profile-value">{username}</span></p>
            <p><span className="profile-label">{t("email")}:</span> <span className="profile-value">{email}</span></p>
            <p><span className="profile-label">{t("accountType")}:</span> <span className="profile-value">{accountType}</span></p>

            {!isLandlord && (
              <>
                <p><span className="profile-label">{t("gender")}:</span> <span className="profile-value">{gender}</span></p>
                <p><span className="profile-label">{t("pronouns")}:</span> <span className="profile-value">{pronouns}</span></p>
                <p><span className="profile-label">{t("age")}:</span> <span className="profile-value">{age}</span></p>
                <p><span className="profile-label">{t("course")}:</span> <span className="profile-value">{course}</span></p>
                <p><span className="profile-label">{t("year")}:</span> <span className="profile-value">{year}</span></p>
                <p><span className="profile-label">{t("smoking")}:</span> <span className="profile-value">{smoking}</span></p>
                <p><span className="profile-label">{t("drinking")}:</span> <span className="profile-value">{drinking}</span></p>
                <p><span className="profile-label">{t("pets")}:</span> <span className="profile-value">{pets}</span></p>
              </>
            )}
          </div>

          {!isLandlord && (
            <div className="profile-section">
              <p><strong>{t("openTo")}</strong></p>
              <ul className="quiz-list">
                {openTo?.smokers && <li>{t("openSmokers")}</li>}
                {openTo?.petOwners && <li>{t("openPets")}</li>}
                {openTo?.mixedGender && <li>{t("openGender")}</li>}
                {openTo?.internationalStudents && <li>{t("openInternational")}</li>}
              </ul>
            </div>
          )}

          <div className="profile-section">
            <p><strong>{t("bio")}</strong><br />{bio || t("noBio")}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Quiz Responses */}
        {!isLandlord && (
          <div className="profile-right">
            {quizResponses && priorityOrder && (
              <div className="quiz-section">
                <h3 className="quiz-title">🧠 {t("quizResponses")}</h3>
                <ul className="quiz-list">
                  {priorityOrder.map((key, index) => (
                    <li key={key} className="quiz-item">
                      <strong>{key} ({t("priority")} {index + 1}):</strong> {quizResponses[key]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STUDENT-ONLY BUTTONS */}
      {!isLandlord && (
        <div className="quiz-buttons-row">
          <div className="quiz-card">
            <span>👥 <strong>{t("groupPrompt")}</strong></span>
            <button onClick={() => navigate("/create-group")}>{t("makeGroup")}</button>
          </div>

          <div className="quiz-card">
            {quizResponses && Object.keys(quizResponses).length > 0 ? (
              <>
                <span>💡 <strong>{t("updateMatchPrompt")}</strong></span>
                <button onClick={() => navigate("/compatibility-quiz")}>{t("editQuiz")}</button>
              </>
            ) : (
              <>
                <span>💡 <strong>{t("takeMatchPrompt")}</strong></span>
                <button onClick={() => navigate("/compatibility-quiz")}>{t("takeQuiz")}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
