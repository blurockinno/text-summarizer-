// models/UserAnswer.js
import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // Assuming you have a User model
  //   required: true,
  // },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the UserAnswer model using ES6 export syntax
const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);
export default UserAnswer;
