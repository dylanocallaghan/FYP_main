import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import './i18n';
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
import MyListings from "./pages/MyListings";
import Contact from './pages/Contact';
import Quiz from "./pages/Quiz";
import Help from './pages/Help';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import './styles/App.css';

function App() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
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
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;
