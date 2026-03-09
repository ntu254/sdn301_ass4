const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true
    },
    options: {
      type: [String],
      validate: {
        validator(options) {
          return Array.isArray(options) && options.length >= 2;
        },
        message: "Question must contain at least 2 options"
      }
    },
    correctAnswerIndex: {
      type: Number,
      required: [true, "correctAnswerIndex is required"],
      min: [0, "correctAnswerIndex must be >= 0"]
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      default: null
    }
  },
  { timestamps: true }
);

questionSchema.pre("validate", function validateCorrectIndex(next) {
  if (!Array.isArray(this.options) || this.options.length === 0) {
    return next();
  }

  if (this.correctAnswerIndex >= this.options.length) {
    return next(
      new Error("correctAnswerIndex must be less than options length")
    );
  }

  return next();
});

module.exports = mongoose.model("Question", questionSchema);
