import { useEffect, useState } from "react";
import axios from "axios";

export default function PendingInvites() {
  const [invites, setInvites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const res = await axios.get("http://localhost:5000/groups/my", {
          headers: { "x-access-token": token },
        });

        const myId = JSON.parse(localStorage.getItem("user"))?._id;
        const pending = res.data.filter((group) =>
          group.pendingInvites.includes(myId)
        );

        setInvites(pending);
      } catch (err) {
        console.error("Error fetching pending invites", err);
      }
    };

    fetchInvites();
  }, []);

  const handleJoin = async (groupId) => {
    try {
      await axios.patch(
        `http://localhost:5000/groups/${groupId}/join`,
        {},
        { headers: { "x-access-token": token } }
      );
      setInvites((prev) => prev.filter((g) => g._id !== groupId));
    } catch (err) {
      console.error("Error joining group", err);
      alert("Failed to join group.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pending Group Invites</h2>
      {invites.length === 0 ? (
        <p>No pending invites found.</p>
      ) : (
        <ul>
          {invites.map((group) => (
            <li key={group._id} style={{ marginBottom: "1rem" }}>
              <p><strong>Group ID:</strong> {group._id}</p>
              <p><strong>Creator:</strong> {group.creator}</p>
              <button
                onClick={() => handleJoin(group._id)}
                style={{
                  padding: "0.4rem 1rem",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                ✅ Join Group
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
