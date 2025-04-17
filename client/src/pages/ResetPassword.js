import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Password reset! Redirecting...");
        setTimeout(() => navigate("/login", { state: { message: "Password reset successful!" } }), 2000);
      } else {
        setStatus(`❌ ${data.error || "Failed to reset password"}`);
      }
    } catch (err) {
      setStatus("❌ Server error. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">Reset Your Password</h2>
      <form onSubmit={handleReset} className="auth-form">
        <input
          type="password"
          placeholder="Enter new password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" className="auth-submit">Set New Password</button>
      </form>
      {status && <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{status}</p>}
    </div>
  );
}
