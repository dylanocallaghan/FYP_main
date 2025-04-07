import React, { useEffect, useState } from "react";
import axios from "axios";

const MyGroup = () => {
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get("http://localhost:5000/groups/mygroup", {
          headers: { "x-access-token": token },
        });
        setGroup(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Error fetching group details"
        );
      }
    };

    fetchGroup();
  }, [token]);

  if (error) return <div style={{ padding: "2rem" }}>{error}</div>;
  if (!group) return <div style={{ padding: "2rem" }}>Loading your group...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👥 Your Group</h2>
      <p>
        <strong>Creator:</strong> {group.creator?.username || group.creator?._id}
      </p>

      <h3>✅ Members</h3>
      <ul>
        {group.members?.map((m) => (
          <li key={m._id}>{m.username || m._id}</li>
        ))}
      </ul>

      {group.pendingInvites?.length > 0 && (
        <>
          <h3>⏳ Pending Invites</h3>
          <ul>
            {group.pendingInvites.map((p) => (
              <li key={p._id}>{p.username || p._id}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MyGroup;
