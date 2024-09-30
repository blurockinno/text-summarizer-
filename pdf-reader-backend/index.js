import express from "express";
import cors from "cors";
import questionRoutes from "./routes/question.js";
import answerRoutes from "./routes/answers.js";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";

import dotenv from "dotenv";
dotenv.config(".env");
const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// Use CORS middleware to allow requests from different origins
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for questions and answers
app.use("/api", questionRoutes);
app.use("/api", answerRoutes);
app.use("/api", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
