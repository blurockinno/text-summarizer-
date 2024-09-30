 {
    // Log the entire request body
  console.log(req.body);

  // Extract questions from the request body
  const { questions } = req.body;

  // Validate that the request body contains an array of questions
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "No questions provided." });
  }

  const failedSaves = [];
  const savedQuestions = [];

  try {
    for (const questionData of questions) {
      const { question, options, answer, description } = questionData;

      // Validate individual question structure
      if (!question || !options || !answer || !description) {
        failedSaves.push({
          question: questionData,
          error: "All fields (question, options, answer, description) are required.",
        });
        continue; // Skip saving this question and move to the next
      }

      // Check if options is an array and has at least two items
      if (!Array.isArray(options) || options.length < 2) {
        failedSaves.push({
          question: questionData,
          error: "Options must be an array with at least two items.",
        });
        continue; // Skip saving this question and move to the next
      }

      // Save the valid question to the database
      const newQuestion = new Question({
        question,
        options,
        answer,
        description,
      });

      const savedQuestion = await newQuestion.save();
      savedQuestions.push(savedQuestion);
    }

    // If no questions were saved successfully, return an error
    if (savedQuestions.length === 0) {
      return res.status(400).json({ message: "No valid questions to save.", failedSaves });
    }

    // Return a success response with saved questions and any failed saves
    return res.status(201).json({
      message: `${savedQuestions.length} questions saved successfully.`,
      savedQuestions,
      failedSaves,
    });
  } catch (error) {
    console.error("Error saving questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
    }