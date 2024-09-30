// controllers/questionController.js
import { Question } from "../models/questionsSchema.js"; // Adjust path if necessary

// Save question
export const saveQuestion = async (req, res) => {
  const {
    class: studentClass,
    subject,
    userId,
    questions: { questions }, // Extract the questions array from the nested structure
  } = req.body;

  console.log("inside my save question controller", req.body); // Log the incoming request data

  // Validation
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "No questions provided." });
  }

  try {
    // Create an array to store questions
    const savedQuestions = [];

    for (const questionData of questions) {
      const { question, options, answer, description } = questionData;

      // Validate individual question data
      if (
        !question ||
        !Array.isArray(options) ||
        options.length === 0 ||
        !answer ||
        !description
      ) {
        return res.status(400).json({
          message:
            "Each question must have a valid question, options, answer, and description.",
        });
      }

      const newQuestion = new Question({
        question,
        options,
        answer,
        description,
        userId, // Associate the question with the user
        class: studentClass, // Associate the question with the class
        subject, // Associate the question with the subject
      });

      const savedQuestion = await newQuestion.save(); // Save the question to the database
      savedQuestions.push(savedQuestion); // Add saved question to the array
    }

    // Log the saved questions to the console
    console.log("Saved Questions:", savedQuestions);

    return res.status(201).json({
      message: "Questions saved successfully.",
      questions: savedQuestions, // Return the saved questions in the response
    });
  } catch (error) {
    console.error("Error saving questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all questions
export const getAllQuestions = async (req, res) => {
  const { class: studentClass, subject } = req.params;

  try {
    // Fetch all questions for the given class and subject, sorted by creation date
    const questions = await Question.find({
      class: studentClass,
      subject,
    })
      .sort({ createdAt: -1 }) // Sort by the most recent first
      .exec();

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this class and subject." });
    }

    return res.status(200).json({
      questions,
    });
  } catch (error) {
    console.error("Error fetching latest questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
