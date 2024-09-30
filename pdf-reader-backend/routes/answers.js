// Importing the Express library, which is used to create a router for handling HTTP requests.
import express from "express";

// Creating an instance of the Express Router, which will be used to define routes.
const router = express.Router();

// Importing the controller functions that will handle the business logic for the routes.
import {
  saveUserAnswer, // Function to save a user's answer to a question.
  getUserAnswers, // Function to retrieve all answers given by a specific user.
} from "../controllers/answerController.js";

// Defining a POST route to save user answers.
// When a POST request is made to '/api/answers', the saveUserAnswer function will be called.
router.post("/answers", saveUserAnswer);

// Defining a GET route to retrieve user answers by user ID.
// The userId parameter is extracted from the URL, and the getUserAnswers function will be called.
router.get("/answers/:userId", getUserAnswers);

// Exporting the router so that it can be used in other parts of the application,
// such as in the main server file where the app is defined.
export default router;
