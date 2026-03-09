import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

export default function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/quizzes">
          Quiz App A4
        </Link>
        {token && (
          <>
            <ul className="navbar-nav me-auto">
              {user?.isAdmin && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/quizzes">
                      Manage Quizzes
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/questions">
                      Manage Questions
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex align-items-center gap-3">
              <span className="text-light small">
                {user
                  ? `${user.name} (${user.isAdmin ? "Admin" : "User"})`
                  : "Loading account..."}
              </span>
              <button
                className="btn btn-warning btn-sm"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
