import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation to get state from navigation
import axios from "axios";

const Login = ({ setUser }) => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // To redirect after login
  const location = useLocation(); // Get the userId from registration page
  const [userDetails, setUserDetails] = useState();
  // Set userId from the location state if it exists
  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    }
  }, [location]);

  const handleLogin = async () => {
    if (!userId) {
      localStorage.setItem("userId", userId);
      setError("User ID is required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        userId,
      });

      if (response.data.success) {
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data.userDetails)
        );

        // Set the logged-in user in the state
        setUser({ userId });

        // Navigate to the questions page or the main page
        navigate("/", { state: { userDetails } });
      }
    } catch (error) {
      setError("Login failed. Invalid User ID.");
    }
  };

  return (
    <div className="login-form bg-white p-6 rounded-md shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="userId">
          User ID
        </label>
        <input
          id="userId"
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition-colors"
      >
        Login
      </button>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <a href="/register" className="text-indigo-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
