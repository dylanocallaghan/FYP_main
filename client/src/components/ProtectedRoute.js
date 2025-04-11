import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext"; // adjust path if needed

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user } = useAuth(); // ✅ get user from context

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: "Please log in or register first" }}
      />
    );
  }

  return children;
}
