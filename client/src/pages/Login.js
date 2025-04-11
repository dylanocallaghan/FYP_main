import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

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
        try {
          await loginUser(data.token, data.user);
          if (setLoggedIn) setLoggedIn(true); // safe check
          navigate("/dashboard", { replace: true });
        } catch (err) {
          console.warn("loginUser() threw but login succeeded:", err);
          // No error message shown here anymore since app still works
          navigate("/dashboard", { replace: true });
        }
      } else {
        setMessage(`❌ ${data.error || "Login failed"}`);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage("❌ Server error. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      {redirectMessage && (
        <p style={{ color: "red", fontWeight: "bold" }}>{redirectMessage}</p>
      )}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
