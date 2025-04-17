import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Reset link sent! Check your email.");
      } else {
        setStatus(`❌ ${data.error || "Failed to send reset link"}`);
      }
    } catch (err) {
      setStatus("❌ Server error. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="auth-submit">Send Reset Link</button>
      </form>
      {status && <p style={{ marginTop: "1rem", fontWeight: "bold", color: "red" }}>{status}</p>}
      <button onClick={() => navigate("/login")} className="auth-submit" style={{ marginTop: "1rem" }}>
        Back to Login
      </button>
    </div>
  );
}
