import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, signupUser } from "../features/auth/authSlice";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());
    try {
      await dispatch(signupUser(form)).unwrap();
      navigate("/quizzes");
    } catch (err) {
      // handled by slice
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h4 mb-3">Signup</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button
              className="btn btn-success w-100"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Creating account..." : "Signup"}
            </button>
          </form>
          <div className="mt-3">
            <span className="small text-muted">Already have account? </span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
