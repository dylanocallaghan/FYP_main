import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import MatchResults from "./pages/MatchResults";
import UserProfile from "./pages/UserProfile";
import CreateGroup from "./pages/CreateGroup";
import ProtectedRoute from "./components/ProtectedRoute";
import Listings from "./pages/Listings"; 
import Inbox from "./pages/Inbox";
import MyGroup from './pages/MyGroup';
import PendingInvites from "./pages/PendingInvites";
import ListingDetails from "./pages/ListingDetails";
import LandlordApplications from "./pages/LandlordApplications";
import AdminDashboard from "./pages/AdminDashboard";
import Quiz from "./pages/Quiz";
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><MatchResults /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
          <Route path="/my-group" element={<ProtectedRoute><MyGroup /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/user-profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/pending-invites" element={<ProtectedRoute><PendingInvites /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/applications" element={<LandlordApplications />} />
          <Route path="/listing/:id" element={<ProtectedRoute><ListingDetails /></ProtectedRoute>} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/compatibility-quiz" element={<Quiz />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
