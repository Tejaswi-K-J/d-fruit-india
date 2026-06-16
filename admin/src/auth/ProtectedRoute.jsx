import { Navigate } from "react-router-dom";

// Decode a JWT payload without a library (safe for client-side expiry check only)
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    // atob handles base64url by replacing URL-safe chars
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded) return false;
  // exp is in seconds; Date.now() is in ms
  const isExpired = decoded.exp * 1000 < Date.now();
  if (isExpired) {
    // Clean up stale token proactively
    localStorage.removeItem("adminToken");
    return false;
  }
  return true;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;