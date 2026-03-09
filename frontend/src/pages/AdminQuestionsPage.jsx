import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuestion,
  deleteQuestion,
  fetchQuestions,
  updateQuestion,
} from "../features/questions/questionsSlice";
import { fetchQuizzes } from "../features/quizzes/quizzesSlice";

const initialForm = {
  text: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
  quizId: "",
};

export default function AdminQuestionsPage() {
  const dispatch = useDispatch();
  const {
    list: questions,
    status,
    mutationStatus,
    error,
  } = useSelector((state) => state.questions);
  const { list: quizzes } = useSelector((state) => state.quizzes);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const quizOptions = useMemo(() => quizzes || [], [quizzes]);

  useEffect(() => {
    if (!form.quizId && quizOptions.length > 0) {
      setForm((prev) => ({ ...prev, quizId: quizOptions[0].id }));
    }
  }, [quizOptions, form.quizId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    setForm((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) {
      alert("Must have at least 2 options");
      return;
    }
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const startEdit = (question) => {
    setEditingId(question._id);
    setForm({
      text: question.text,
      options: [...question.options],
      correctAnswerIndex: question.correctAnswerIndex,
      quizId: question.quiz?._id || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      text: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      quizId: quizOptions[0]?.id || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const options = form.options.map((item) => item.trim()).filter(Boolean);

    if (options.length < 2) {
      alert("Must have at least 2 options");
      return;
    }

    const payload = {
      text: form.text,
      options,
      correctAnswerIndex: Number(form.correctAnswerIndex),
      quizId: form.quizId,
    };

    try {
      if (editingId) {
        await dispatch(updateQuestion({ id: editingId, payload })).unwrap();
      } else {
        await dispatch(createQuestion(payload)).unwrap();
      }

      resetForm();
      dispatch(fetchQuestions());
    } catch (err) {
      // handled by slice state
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?",
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteQuestion(id)).unwrap();
      dispatch(fetchQuestions());
    } catch (err) {
      // handled by slice state
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4">Questions</h1>

      <div className="row">
        {/* Left Column - Form */}
        <div className="col-lg-5">
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h2 className="h5 mb-3">
                {editingId ? "Edit Question" : "Add Question"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Quiz</label>
                  <select
                    className="form-select"
                    name="quizId"
                    value={form.quizId}
                    onChange={handleChange}
                    required
                  >
                    {quizOptions.map((quiz) => (
                      <option key={quiz.id} value={quiz.id}>
                        {quiz.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Question Text</label>
                  <input
                    className="form-control"
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Options</label>
                  {form.options.map((option, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        className="form-control"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      {form.options.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeOption(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={addOption}
                  >
                    + Add Option
                  </button>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Correct Answer Index (starts from 0)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="correctAnswerIndex"
                    min={0}
                    value={form.correctAnswerIndex}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary w-100"
                    disabled={mutationStatus === "loading"}
                  >
                    {editingId ? "Update Question" : "Add Question"}
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

        {/* Right Column - Questions List */}
        <div className="col-lg-7">
          {status === "loading" && <p>Loading questions...</p>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row row-cols-1 g-3">
            {questions.map((question) => (
              <div key={question._id} className="col">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h3 className="h5 mb-3">{question.text}</h3>
                    <ul className="list-unstyled mb-3">
                      {question.options.map((option, idx) => (
                        <li key={idx} className="mb-1">
                          {idx === question.correctAnswerIndex && (
                            <span className="badge bg-success me-2">✓</span>
                          )}
                          {option}
                        </li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Quiz: {question.quiz?.title || "N/A"}
                      </small>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => startEdit(question)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(question._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
