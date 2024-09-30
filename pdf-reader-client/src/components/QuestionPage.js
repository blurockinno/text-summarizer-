import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls

const QuestionPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [submittedAnswers, setSubmittedAnswers] = useState([]); // Store answers with question IDs

  // Fetch questions from the API
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getAllQuestions"
      );
      console.log(response.data);

      if (response.data.questions.length === 0) {
        // If no questions exist, you might want to save default questions
      } else {
        setQuestionData(response.data.questions); // Access the questions array directly
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    // Update the submittedAnswers state with the current answer
    setSubmittedAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (entry) => entry.questionId === questionData[currentQuestionIndex]._id
      );

      if (existingAnswerIndex > -1) {
        // If the answer already exists, update it
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = {
          questionId: questionData[currentQuestionIndex]._id,
          selectedAnswer: answer,
        };
        return updatedAnswers;
      } else {
        // Otherwise, add a new answer
        return [
          ...prev,
          {
            questionId: questionData[currentQuestionIndex]._id,
            selectedAnswer: answer,
          },
        ];
      }
    });
  };

  const handleNextQuestion = () => {
    // Move to the next question
    if (currentQuestionIndex < questionData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(
        submittedAnswers.find(
          (entry) =>
            entry.questionId === questionData[currentQuestionIndex + 1]._id
        )?.selectedAnswer || null
      ); // Preserve selected answer
    }
  };

  const handlePreviousQuestion = () => {
    // Move to the previous question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(
        submittedAnswers.find(
          (entry) =>
            entry.questionId === questionData[currentQuestionIndex - 1]._id
        )?.selectedAnswer || null
      ); // Preserve selected answer
    }
  };

  const handleSubmitAllAnswers = async () => {
    try {
      await axios.post("http://localhost:5000/api/answers", {
        answers: submittedAnswers, // Send all answers to the server
      });
      console.log("All answers saved successfully.");
      alert("All answers submitted!");
      // Optionally, redirect or reset state here
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const question = questionData[currentQuestionIndex];

  return (
    <div>
      {Array.isArray(questionData) && question ? (
        <div className="mb-4 p-4 border-b border-gray-200">
          <h4 className="font-bold">{`Q${currentQuestionIndex + 1}: ${
            question.question
          }`}</h4>
          <ul className="list-disc ml-5">
            {question.options.map((option, idx) => (
              <li key={idx}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousQuestion}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!selectedAnswer}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No questions to display.</p>
      )}

      {currentQuestionIndex === questionData.length - 1 && ( // Show submit button on the last question
        <button
          onClick={handleSubmitAllAnswers}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit All Answers
        </button>
      )}
    </div>
  );
};

export default QuestionPage;
