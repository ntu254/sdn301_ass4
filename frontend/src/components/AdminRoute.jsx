import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
  const { token, user, authChecked } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!authChecked) {
    return (
      <div className="container">
        <p className="mb-0">Checking admin access...</p>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return <Navigate to="/quizzes" replace />;
  }

  return children;
}