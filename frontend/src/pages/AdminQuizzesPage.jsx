import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuiz,
  deleteQuiz,
  fetchQuizzes,
  updateQuiz,
} from "../features/quizzes/quizzesSlice";

const initialForm = {
  title: "",
  description: "",
};

export default function AdminQuizzesPage() {
  const dispatch = useDispatch();
  const {
    list: quizzes,
    listStatus,
    mutationStatus,
    error,
  } = useSelector((state) => state.quizzes);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (quiz) => {
    setEditingId(quiz._id || quiz.id);
    setForm({
      title: quiz.title,
      description: quiz.description || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      questionIds: [],
    };

    try {
      if (editingId) {
        await dispatch(updateQuiz({ id: editingId, payload })).unwrap();
      } else {
        await dispatch(createQuiz(payload)).unwrap();
      }

      resetForm();
      dispatch(fetchQuizzes());
    } catch (err) {
      // handled by slice state
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz? All questions in this quiz will also be deleted.",
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteQuiz(id)).unwrap();
      dispatch(fetchQuizzes());
    } catch (err) {
      // handled by slice state
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4">Quiz Management</h1>

      <div className="row">
        {/* Left Column - Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h2 className="h5 mb-3">
                {editingId ? "Edit Quiz" : "Create New Quiz"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary w-100"
                    disabled={mutationStatus === "loading"}
                  >
                    {editingId ? "Update Quiz" : "Create Quiz"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Quiz List */}
        <div className="col-lg-8">
          {listStatus === "loading" && <p>Loading quizzes...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Questions</th>
                      <th style={{ width: 200 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.length > 0 ? (
                      quizzes.map((quiz) => (
                        <tr key={quiz._id || quiz.id}>
                          <td className="fw-medium">{quiz.title}</td>
                          <td>{quiz.description || "-"}</td>
                          <td>
                            {quiz.questionCount || quiz.questions?.length || 0}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => startEdit(quiz)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleDelete(quiz._id || quiz.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          No quizzes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
