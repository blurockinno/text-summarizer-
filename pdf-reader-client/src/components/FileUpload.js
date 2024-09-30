import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { chatSession } from "../utils/gemin-prompt";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const FileUpload = () => {
  const [pdfText, setPdfText] = useState("");
  const [userName, setUserName] = useState(""); // Added userName state
  const [userClass, setUserClass] = useState("8");
  const [subject, setSubject] = useState("math");
  const [languageType, setLanguageType] = useState(""); // Added languageType state
  const [userPrompt, setUserPrompt] = useState(
    `You are an AI assistant for creating multiple-choice quizzes. Please generate 20 multiple-choice questions for a [CLASS- 8] student in the subject of [SUBJECT-math]. 
    Each question should include:
    1. A question statement.
    2. Four answer options.
    3. The correct answer.
    4. A short description explaining why the correct answer is correct.
    Return the result in JSON format, where each object contains:
    - "question": The question text.
    - "options": An array of four answer options.
    - "correct_answer": The correct answer from the options.
    - "description": A short description of why the answer is correct.
    Make sure the questions are appropriate for the selected class and subject.`
  );
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const location = useLocation(); // Get the userId from registration page
  const [userDetails, setUserDetails] = useState();
  // Set userId from the location state if it exists
  useEffect(() => {
    if (location.state?.userDetails) {
      setUserDetails(location.state?.userDetails);
    }
  }, [location]);
  const sanitizeResponse = (text) => {
    return text.replace(/\*\*/g, "");
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPdfText(response.data.text);
    } catch (error) {
      console.error("Error uploading the file:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf",
  });

  const handleSummarize = async () => {
    setLoading(true);
    let formattedText;

    if (pdfText) {
      formattedText = `${pdfText}\n${userPrompt}`;
    } else {
      formattedText = `Please generate 20 multiple-choice questions for a [CLASS- ${userClass}] student in the subject of [SUBJECT-${subject}]. 
      Each question should include:
      1. A question statement.
      2. Four answer options.
      3. The correct answer.
      4. A short description explaining why the correct answer is correct.
      Return the result in JSON format with the structure:
      {
        "questions": [
          {
            "question": "Sample Question",
            "options": ["Option1", "Option2", "Option3", "Option4"],
            "answer": "Option3",
            "description": "Explanation for the correct answer"
          }
        ]
      }`;
    }

    try {
      const result = await chatSession.sendMessage(formattedText);
      const jsonMockResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      const parsedQuestions = JSON.parse(jsonMockResp);
      setSummary(parsedQuestions);

      const userData = localStorage.getItem("userData");
      const user = JSON.parse(userData);
      const payload = {
        class: userClass,
        subject,
        userId: user._id, // Replace with actual user ID
        userName, // Add the user's name
        questions: parsedQuestions,
      };

      // Save questions to the backend
      await axios.post(
        "http://localhost:5000/api/questions/generate",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Questions saved successfully.");

      // Navigate to questions page after saving
      navigate("/questions"); // Update to the correct path for your questions page
    } catch (error) {
      console.error("Error generating or saving questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6 w-full max-w-md mx-auto transition-transform transform hover:scale-105">
      <div
        {...getRootProps({
          className:
            "border-dashed border-4 border-indigo-300 bg-indigo-50 py-2 rounded-lg cursor-pointer flex justify-center items-center transition-colors duration-200 hover:bg-indigo-200",
        })}
      >
        <input {...getInputProps()} />
        <p className="text-center text-indigo-700 text-lg font-medium">
          Drag & drop a PDF file here, or click to select one
        </p>
      </div>

      <textarea
        value={pdfText}
        readOnly
        className="w-full h-36 p-4 bg-gray-100 rounded-lg text-gray-700 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Uploaded PDF text will appear here"
      />

      <div className="space-y-3">
        {[
          {
            id: "userName",
            label: "Enter your name:",
            value: userName,
            setValue: setUserName,
          },
          {
            id: "userClass",
            label: "Enter class:",
            value: userClass,
            setValue: setUserClass,
          },
          {
            id: "subject",
            label: "Enter subject:",
            value: subject,
            setValue: setSubject,
          },
          {
            id: "languageType",
            label: "Enter language type:",
            value: languageType,
            setValue: setLanguageType,
          },
        ].map(({ id, label, value, setValue }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block text-lg font-medium text-indigo-600"
            >
              {label}
            </label>
            <input
              id={id}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSummarize}
        disabled={loading}
        className={`w-full py-3 mt-4 text-lg text-white rounded-lg shadow-md ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200"
        }`}
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>
    </div>
  );
};

export default FileUpload;
