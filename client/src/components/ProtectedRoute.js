import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, loggedIn }) {
  const location = useLocation();

  if (!loggedIn) {
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
