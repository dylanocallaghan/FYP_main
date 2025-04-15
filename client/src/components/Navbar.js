// Navbar.js
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/Navbar.css";
import axios from "axios";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);
  const [hasInvite, setHasInvite] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchGroupStatus = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/groups/mygroup", {
          headers: { "x-access-token": token },
        });

        const group = res.data;
        if (!group) return;

        const userId = user.id || user._id;

        const isMember = group.members.some((m) => m._id === userId);
        const isCreator = group.creator._id === userId;
        const hasInvitePending = group.pendingInvites.some((inv) => inv._id === userId);

        setHasGroup(isCreator || isMember);
        setHasInvite(hasInvitePending);
      } catch (err) {
        setHasGroup(false);
        setHasInvite(false);
      }
    };

    fetchGroupStatus();
  }, [user]);

  // ✅ Auto-close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const accountType = user?.accountType;

  const show = {
    dashboard: ["student", "admin", "listing owner"].includes(accountType),
    inbox: !!user,
    matches: ["student", "admin"].includes(accountType),
    listings: true,
    createListing: ["listing owner", "admin"].includes(accountType),
    applications: ["listing owner", "admin"].includes(accountType),
    groups: hasGroup,
    invites: hasInvite,
    admin: accountType === "admin",
  };

  return (
    <nav className="navbar">
      <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>☰</div>

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
          {accountType === "listing owner" && (
            <Link to="/my-listings">📋 My Listings</Link>
          )}
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
