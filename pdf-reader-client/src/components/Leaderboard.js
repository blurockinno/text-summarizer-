import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const location = useLocation();
  const { answers, questions } = location.state || {};
  const navigate = useNavigate();

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg space-y-4">
      <h3 className="text-xl font-bold text-indigo-600">Leaderboard</h3>
      <p>
        Your Score: {score}/{questions.length}
      </p>

      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold">{question.question}</p>
          <p>Your answer: {answers[index]}</p>
          <p>Correct answer: {question.answer}</p>
        </div>
      ))}

      <button
        onClick={() => navigate("/")}
        className="w-full py-3 mt-4 text-lg text-white bg-indigo-600 rounded-lg shadow-md"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Leaderboard;
