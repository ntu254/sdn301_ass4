const express = require("express");
const {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz
} = require("../controllers/quizController");
const { protect, adminOnly } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);
router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.post("/:id/submit", submitQuiz);

router.post("/", adminOnly, createQuiz);
router.put("/:id", adminOnly, updateQuiz);
router.delete("/:id", adminOnly, deleteQuiz);

module.exports = router;
