// Navbar.js
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const accountType = user?.accountType;

  const show = {
    dashboard: accountType === "student" || accountType === "admin" || accountType === "listing owner",
    inbox: !!user,
    matches: accountType === "student" || accountType === "admin",
    listings: true,
    createListing: accountType === "listing owner" || accountType === "admin",
    applications: accountType === "listing owner" || accountType === "admin",
    groups: accountType === "student" || accountType === "admin",
    invites: accountType === "student" || accountType === "admin",
    admin: accountType === "admin",
  };

  return (
    <nav className="navbar">
      <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <div className="nav-left">
          {show.dashboard && <Link to="/dashboard">Dashboard</Link>}
          {show.listings && <Link to="/listings">🏠 Listings</Link>}
          {show.matches && <Link to="/matches">❤️ Matches</Link>}
          {show.inbox && <Link to="/inbox">📥 Inbox</Link>}
          {show.createListing && <Link to="/create">📦 Create Listing</Link>}
          {show.applications && <Link to="/applications">Applications</Link>}
          {show.groups && <Link to="/my-group">👥 Groups</Link>}
          {show.invites && <Link to="/pending-invites">Invites</Link>}
          {show.admin && <Link to="/admin">Admin</Link>}
        </div>

        <div className="nav-right">
          {user ? (
            <button onClick={logoutUser} className="logout-btn">Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
