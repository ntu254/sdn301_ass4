import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearCurrentQuiz,
  clearSubmitResult,
  fetchQuizById,
  submitQuiz,
} from "../features/quizzes/quizzesSlice";

export default function QuizTakePage() {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const { currentQuiz, detailStatus, submitStatus, submitResult, error } =
    useSelector((state) => state.quizzes);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setSelected({});
    dispatch(clearSubmitResult());
    dispatch(fetchQuizById(quizId));

    return () => {
      dispatch(clearCurrentQuiz());
    };
  }, [dispatch, quizId]);

  const questions = currentQuiz?.questions || [];

  const handleSelect = (questionId, optionIndex) => {
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    const answers = Object.entries(selected).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      }),
    );

    await dispatch(submitQuiz({ quizId, answers }));
  };

  return (
    <div className="container">
      {detailStatus === "loading" && <p>Loading quiz...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {currentQuiz && (
        <>
          <h1 className="h3">{currentQuiz.title}</h1>
          <p className="text-muted">{currentQuiz.description}</p>
          <p className="small text-muted">
            Answered {Object.keys(selected).length} / {questions.length}
          </p>

          {questions.map((question, idx) => (
            <div className="card mb-3 shadow-sm" key={question._id}>
              <div className="card-body">
                <h2 className="h6">
                  {idx + 1}. {question.text}
                </h2>
                <div className="mt-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      className="form-check"
                      key={`${question._id}-${optionIndex}`}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name={question._id}
                        id={`${question._id}-${optionIndex}`}
                        checked={selected[question._id] === optionIndex}
                        onChange={() => handleSelect(question._id, optionIndex)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`${question._id}-${optionIndex}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={submitStatus === "loading"}
          >
            {submitStatus === "loading" ? "Submitting..." : "Finish Quiz"}
          </button>

          {submitResult && (
            <div className="alert alert-info mt-3">
              <strong>
                Score: {submitResult.score} / {submitResult.total}
              </strong>
            </div>
          )}
        </>
      )}
    </div>
  );
}
