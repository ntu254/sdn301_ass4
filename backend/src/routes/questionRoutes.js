const express = require("express");
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require("../controllers/questionController");
const { protect, adminOnly } = require("../middlewares/auth");

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getQuestions);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
