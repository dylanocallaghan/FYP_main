import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("token");
      
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          const data = await res.json();
          console.log("Fetched user data:", data); // ✅ Add this
          setUser(data);
        } catch (err) {
          console.error("Profile fetch failed:", err); // ✅ Add this
        }
      };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h3>Roommate Quiz Responses</h3>
      <ul>
        {Object.entries(user.quizResponses || {}).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
    </div>
  );
}
