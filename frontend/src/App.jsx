import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchMe } from "./features/auth/authSlice";
import AdminQuestionsPage from "./pages/AdminQuestionsPage";
import AdminQuizzesPage from "./pages/AdminQuizzesPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import QuizListPage from "./pages/QuizListPage";
import QuizTakePage from "./pages/QuizTakePage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, token, user]);

  return (
    <div className="min-vh-100 bg-light">
      <AppNavbar />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/quizzes" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/quizzes" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/quizzes" replace /> : <SignupPage />}
        />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId/take"
          element={
            <ProtectedRoute>
              <QuizTakePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <AdminRoute>
              <AdminQuizzesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <AdminRoute>
              <AdminQuestionsPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
