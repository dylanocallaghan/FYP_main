import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import MatchResults from "./pages/MatchResults";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Listings from "./pages/Listings"; 
import Inbox from "./pages/Inbox";
import ListingDetails from "./pages/ListingDetails";
import LandlordApplications from "./pages/LandlordApplications";
import './styles/App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null); //  Track logged-in user

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
      <div className="app-content">
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
          <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route
            path="/listings"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Listings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route path="/applications" element={<LandlordApplications />} />
          <Route
            path="/listing/:id"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <ListingDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
