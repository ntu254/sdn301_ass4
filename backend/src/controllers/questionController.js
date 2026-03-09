const mongoose = require("mongoose");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const getQuestions = async (req, res) => {
  const questions = await Question.find().populate("quiz", "title");
  return res.status(200).json(questions);
};

const createQuestion = async (req, res) => {
  const { text, options, correctAnswerIndex, quizId } = req.body;

  if (!text || !Array.isArray(options) || options.length < 2) {
    return res
      .status(400)
      .json({ message: "text and at least 2 options are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(400).json({ message: "Invalid quizId" });
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  const question = await Question.create({
    text,
    options,
    correctAnswerIndex,
    quiz: quizId
  });

  await Quiz.findByIdAndUpdate(quizId, { $addToSet: { questions: question._id } });

  const populatedQuestion = await Question.findById(question._id).populate("quiz", "title");
  return res.status(201).json(populatedQuestion);
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { text, options, correctAnswerIndex, quizId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid question id" });
  }

  const question = await Question.findById(id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  if (quizId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quizId" });
    }

    const nextQuiz = await Quiz.findById(quizId);
    if (!nextQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
  }

  const previousQuizId = question.quiz ? String(question.quiz) : null;

  if (text !== undefined) {
    question.text = text;
  }

  if (options !== undefined) {
    if (!Array.isArray(options) || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Question must contain at least 2 options" });
    }
    question.options = options;
  }

  if (correctAnswerIndex !== undefined) {
    question.correctAnswerIndex = correctAnswerIndex;
  }

  if (quizId !== undefined) {
    question.quiz = quizId;
  }

  await question.save();

  if (quizId !== undefined && quizId !== previousQuizId) {
    if (previousQuizId) {
      await Quiz.findByIdAndUpdate(previousQuizId, {
        $pull: { questions: question._id }
      });
    }

    await Quiz.findByIdAndUpdate(quizId, {
      $addToSet: { questions: question._id }
    });
  }

  const populatedQuestion = await Question.findById(question._id).populate("quiz", "title");
  return res.status(200).json(populatedQuestion);
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid question id" });
  }

  const question = await Question.findByIdAndDelete(id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  await Quiz.findByIdAndUpdate(question.quiz, { $pull: { questions: question._id } });
  return res.status(200).json({ message: "Question deleted successfully" });
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};