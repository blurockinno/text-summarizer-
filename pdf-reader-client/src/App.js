import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import QuestionPage from "./components/QuestionPage";
import Leaderboard from "./components/Leaderboard";
import Register from "./components/UserRegister";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  const [questions, setQuestions] = useState([]); // State to store generated questions
  const [user, setUser] = useState(null); // State to store logged-in user info

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-rose-100 to-purple-300 flex items-center justify-center p-4">
        <div className="w-full">
          <Routes>
            {/* Registration Page */}
            <Route path="/register" element={<Register setUser={setUser} />} />

            {/* Login Page */}
            <Route path="/login" element={<Login setUser={setUser} />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <FileUpload setQuestions={setQuestions} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/questions"
              element={
                <ProtectedRoute user={user}>
                  <QuestionPage questions={questions} user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute user={user}>
                  <Leaderboard questions={questions} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
