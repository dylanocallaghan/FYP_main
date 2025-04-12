import { useLocation, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  if (!profile) {
    return <div style={{ padding: "2rem" }}>Profile not found.</div>;
  }

  const {
    name,
    username,
    email,
    accountType,
    quizResponses,
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
    <div style={{ padding: "2rem" }}>
      <h2>{name}'s Profile</h2>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Account Type:</strong> {accountType}</p>
      <p><strong>Gender:</strong> {gender}</p>
      <p><strong>Pronouns:</strong> {pronouns}</p>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Course:</strong> {course}</p>
      <p><strong>Year:</strong> {year}</p>
      <p><strong>Smoker:</strong> {smoking}</p>
      <p><strong>Drinks Alcohol:</strong> {drinking}</p>
      <p><strong>Has Pets:</strong> {pets}</p>

      <h3>Open To:</h3>
      <ul>
        {openTo?.smokers && <li>Living with smokers</li>}
        {openTo?.petOwners && <li>Living with pet owners</li>}
        {openTo?.mixedGender && <li>Mixed-gender households</li>}
        {openTo?.internationalStudents && <li>International students</li>}
      </ul>

      {bio && (
        <>
          <h3>Bio</h3>
          <p>{bio}</p>
        </>
      )}

      <h3>Roommate Quiz Responses</h3>
      <ul>
        {quizResponses &&
          Object.entries(quizResponses).map(([key, value]) => (
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
        🔙 Back
      </button>
    </div>
  );
}
