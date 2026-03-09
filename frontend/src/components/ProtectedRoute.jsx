import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { token, authChecked } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!authChecked) {
    return (
      <div className="container">
        <p className="mb-0">Checking session...</p>
      </div>
    );
  }

  return children;
}