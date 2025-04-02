import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import MatchResults from "./pages/MatchResults";
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat"; // ✅ Import Chat
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // ✅ Track logged-in user

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setLoggedIn(!!token);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        handleLogout={handleLogout}
      />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<ProtectedRoute loggedIn={loggedIn}><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute loggedIn={loggedIn}><Profile /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute loggedIn={loggedIn}><MatchResults /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute loggedIn={loggedIn}><UserProfile /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute loggedIn={loggedIn}><CreateListing /></ProtectedRoute>} />
          <Route path="/profile" element={
            <ProtectedRoute loggedIn={loggedIn}>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/chat" element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Chat loggedInUser={user} /> {/* ✅ Fixed */}
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
