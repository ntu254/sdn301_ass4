import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchQuizzes } from "../features/quizzes/quizzesSlice";

export default function QuizListPage() {
  const dispatch = useDispatch();
  const { list, listStatus, error } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Available Quizzes</h1>
      </div>

      {listStatus === "loading" && <p>Loading quizzes...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {list.map((quiz) => (
          <div className="col-md-6" key={quiz.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h2 className="h5">{quiz.title}</h2>
                <p className="text-muted mb-2">
                  {quiz.description || "No description"}
                </p>
                <p className="small mb-3">Questions: {quiz.questionCount}</p>
                <Link
                  className="btn btn-primary btn-sm"
                  to={`/quizzes/${quiz.id}/take`}
                >
                  Do Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
