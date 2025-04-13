import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../styles/Login.css";

export default function Login({ setLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setRedirectMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        let userWithGroup = { ...data.user };

        // ✅ Fetch group using token-based /groups/mygroup route
        try {
          const groupRes = await fetch("http://localhost:5000/groups/mygroup", {
            headers: {
              "x-access-token": data.token,
              "Content-Type": "application/json"
            }
          });

          if (groupRes.ok) {
            const groupData = await groupRes.json();
            if (groupData && groupData._id) {
              userWithGroup.groupId = groupData._id;
            }
          }
        } catch (groupErr) {
          console.warn("No group found or failed to fetch group info.");
        }

        await loginUser(data.token, userWithGroup);

        if (setLoggedIn) setLoggedIn(true);
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(`❌ ${data.error || "Login failed"}`);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">Login</h2>
      {redirectMessage && <p style={{ color: "red", fontWeight: "bold" }}>{redirectMessage}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          placeholder="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="auth-submit">Login</button>
      </form>
      {message && <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
