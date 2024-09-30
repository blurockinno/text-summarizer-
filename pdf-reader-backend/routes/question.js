// routes/question.js
import express from "express";
const router = express.Router();
import {
  saveQuestion,
  getAllQuestions,
} from "../controllers/questionController.js";

// Save question route
router.post("/questions/generate", saveQuestion);

// Get all questions route
router.get("/getAllQuestions", getAllQuestions);

export default router;
