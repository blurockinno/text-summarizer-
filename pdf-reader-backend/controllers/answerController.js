// Importing the UserAnswer model, which represents the schema for storing user answers in the database.
import UserAnswer from "../models/UserAnswerSchema.js";

// Controller function to save user answers to the database.
export const saveUserAnswer = async (req, res) => {
  // Extracting the answers array from the request body. 
  // It expects an array of answer objects containing question IDs and selected answers.
  const { answers } = req.body;

  // Basic validation: Checking if answers is an array and not empty.
  if (!Array.isArray(answers) || answers.length === 0) {
    // If validation fails, return a 400 status with an error message.
    return res
      .status(400)
      .json({ message: "An array of answers is required." });
  }

  // Validate each answer object in the answers array.
  for (const answer of answers) {
    // Check if each answer has a questionId and selectedAnswer.
    if (!answer.questionId || !answer.selectedAnswer) {
      // If validation fails for any answer, return a 400 status with an error message.
      return res
        .status(400)
        .json({
          message:
            "Each answer must contain a question ID and a selected answer.",
        });
    }
  }

  try {
    // Map through the answers array to create new UserAnswer instances for each answer.
    const newAnswers = answers.map(
      ({ questionId, selectedAnswer }) =>
        new UserAnswer({ questionId, selectedAnswer })
    );

    // Use insertMany to save all answers to the database at once, improving performance.
    await UserAnswer.insertMany(newAnswers);

    // Return a 201 status with a success message if all answers are saved successfully.
    return res.status(201).json({ message: "All answers saved successfully." });
  } catch (error) {
    // Log any errors that occur during the saving process.
    console.error("Error saving answers:", error);
    // Return a 500 status with an error message if an internal server error occurs.
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to retrieve all user answers from the database based on user ID.
export const getUserAnswers = async (req, res) => {
  // Extracting the userId from the route parameters.
  const { userId } = req.params;

  try {
    // Query the database to find all answers related to the specified userId, 
    // populating the questionId field with corresponding question details.
    const answers = await UserAnswer.find({ userId }).populate("questionId");
    
    // Return a 200 status with the retrieved answers.
    res.status(200).json(answers);
  } catch (error) {
    // Log any errors that occur during the fetching process.
    console.error("Error fetching answers:", error);
    // Return a 500 status with an error message if an internal server error occurs.
    res.status(500).json({ message: "Internal server error" });
  }
};
