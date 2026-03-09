require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

const seed = async () => {
  await connectDB();

  await Question.deleteMany({});
  await Quiz.deleteMany({});
  await User.deleteMany({});

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    isAdmin: true
  });

  await User.create({
    name: "Student User",
    email: "user@example.com",
    password: "123456",
    isAdmin: false
  });

  const quiz = await Quiz.create({
    title: "General Knowledge Quiz",
    description: "Basic quiz for Assignment 4 demo",
    createdBy: admin._id,
    questions: []
  });

  const questions = await Question.insertMany([
    {
      text: "What is the capital of France?",
      options: ["Berlin", "Paris", "Rome", "Madrid"],
      correctAnswerIndex: 1,
      quiz: quiz._id
    },
    {
      text: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      correctAnswerIndex: 1,
      quiz: quiz._id
    },
    {
      text: "2 + 2 equals?",
      options: ["3", "4", "5", "22"],
      correctAnswerIndex: 1,
      quiz: quiz._id
    }
  ]);

  quiz.questions = questions.map((q) => q._id);
  await quiz.save();

  console.log("Seed completed");
  console.log("Admin: admin@example.com / 123456");
  console.log("User: user@example.com / 123456");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
