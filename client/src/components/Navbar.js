import { Link } from "react-router-dom";

export default function Navbar({ loggedIn, handleLogout }) {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/chat">💬 Chat</Link>
      <Link to="/inbox">📥 Inbox</Link>
      <Link to="/matches">❤️ Matches</Link>
      <Link to="/listings">🏠 Listings</Link>
      <Link to="/create">📦 Create Listing</Link>

      <div style={{ marginLeft: "auto" }}>
        {loggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
