const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const validateQuestionIds = async (questionIds) => {
  const uniqueQuestionIds = [...new Set(questionIds.map((id) => String(id)))];

  const hasInvalidId = uniqueQuestionIds.some(
    (questionId) => !mongoose.Types.ObjectId.isValid(questionId)
  );

  if (hasInvalidId) {
    return {
      error: {
        status: 400,
        message: "Each questionId must be a valid MongoDB ObjectId"
      }
    };
  }

  const questions = await Question.find({
    _id: { $in: uniqueQuestionIds }
  }).select("_id quiz");

  if (questions.length !== uniqueQuestionIds.length) {
    return {
      error: {
        status: 404,
        message: "One or more questions were not found"
      }
    };
  }

  return { questions, uniqueQuestionIds };
};

const getQuizzes = async (req, res) => {
  const quizzes = await Quiz.find()
    .populate("createdBy", "name email")
    .select("title description questions createdBy createdAt updatedAt");

  const data = quizzes.map((quiz) => ({
    id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    createdBy: quiz.createdBy,
    createdAt: quiz.createdAt
  }));

  return res.status(200).json(data);
};

const getQuizById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid quiz id" });
  }

  const populateSelect = req.user.isAdmin
    ? "text options correctAnswerIndex"
    : "text options";

  const quiz = await Quiz.findById(id).populate({
    path: "questions",
    select: populateSelect
  });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  return res.status(200).json(quiz);
};

const createQuiz = async (req, res) => {
  const { title, description, questionIds = [] } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Quiz title is required" });
  }

  if (!Array.isArray(questionIds)) {
    return res.status(400).json({ message: "questionIds must be an array" });
  }

  const { error, questions = [], uniqueQuestionIds = [] } = await validateQuestionIds(
    questionIds
  );

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  const quiz = await Quiz.create({
    title,
    description: description || "",
    questions: uniqueQuestionIds,
    createdBy: req.user._id
  });

  if (uniqueQuestionIds.length > 0) {
    const previousQuizIds = [
      ...new Set(
        questions
          .map((question) => (question.quiz ? String(question.quiz) : null))
          .filter(Boolean)
      )
    ];

    if (previousQuizIds.length > 0) {
      await Quiz.updateMany(
        { _id: { $in: previousQuizIds } },
        { $pull: { questions: { $in: uniqueQuestionIds } } }
      );
    }

    await Question.updateMany(
      { _id: { $in: uniqueQuestionIds } },
      { $set: { quiz: quiz._id } }
    );
  }

  return res.status(201).json(quiz);
};

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description, questionIds } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid quiz id" });
  }

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  if (title !== undefined) {
    quiz.title = title;
  }

  if (description !== undefined) {
    quiz.description = description;
  }

  if (questionIds !== undefined) {
    if (!Array.isArray(questionIds)) {
      return res.status(400).json({ message: "questionIds must be an array" });
    }

    const { error, questions = [], uniqueQuestionIds = [] } = await validateQuestionIds(
      questionIds
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    const previousQuestionIds = quiz.questions.map((questionId) => String(questionId));
    const removedQuestionIds = previousQuestionIds.filter(
      (questionId) => !uniqueQuestionIds.includes(questionId)
    );

    if (removedQuestionIds.length > 0) {
      await Question.updateMany(
        { _id: { $in: removedQuestionIds } },
        { $set: { quiz: null } }
      );
    }

    if (uniqueQuestionIds.length > 0) {
      const previousQuizIds = [
        ...new Set(
          questions
            .map((question) => {
              if (!question.quiz || String(question.quiz) === String(quiz._id)) {
                return null;
              }

              return String(question.quiz);
            })
            .filter(Boolean)
        )
      ];

      if (previousQuizIds.length > 0) {
        await Quiz.updateMany(
          { _id: { $in: previousQuizIds } },
          { $pull: { questions: { $in: uniqueQuestionIds } } }
        );
      }

      await Question.updateMany(
        { _id: { $in: uniqueQuestionIds } },
        { $set: { quiz: quiz._id } }
      );
    }

    quiz.questions = uniqueQuestionIds;
  }

  await quiz.save();
  return res.status(200).json(quiz);
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid quiz id" });
  }

  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  await Question.deleteMany({ _id: { $in: quiz.questions } });
  return res.status(200).json({ message: "Quiz deleted successfully" });
};

const submitQuiz = async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid quiz id" });
  }

  if (!Array.isArray(answers)) {
    return res.status(400).json({ message: "answers must be an array" });
  }

  const quiz = await Quiz.findById(id).populate("questions");
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  const answerMap = new Map();
  answers.forEach((answer) => {
    if (answer?.questionId) {
      answerMap.set(String(answer.questionId), answer.selectedOptionIndex);
    }
  });

  let score = 0;
  const details = quiz.questions.map((question) => {
    const selectedOptionIndex = answerMap.get(String(question._id));
    const isCorrect = selectedOptionIndex === question.correctAnswerIndex;

    if (isCorrect) {
      score += 1;
    }

    return {
      questionId: question._id,
      selectedOptionIndex:
        typeof selectedOptionIndex === "number" ? selectedOptionIndex : null,
      correctAnswerIndex: question.correctAnswerIndex,
      isCorrect
    };
  });

  return res.status(200).json({
    quizId: quiz._id,
    total: quiz.questions.length,
    score,
    details
  });
};

module.exports = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
};