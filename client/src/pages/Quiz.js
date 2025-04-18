import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// inizialise questions
const questions = [
  { key: "cleanliness", text: "I like to keep my living space clean and organized." },
  { key: "sleepSchedule", text: "I prefer to follow a consistent sleep schedule." },
  { key: "sociability", text: "I enjoy socializing regularly with the people I live with." },
  { key: "guestPolicy", text: "I'm comfortable having guests over at the house." },
  { key: "personalSpace", text: "I need personal space and time to myself at home." },
  { key: "financialHabits", text: "I am responsible when it comes to managing money." },
  { key: "studyHabits", text: "I prefer a quiet environment to focus on my studies." },
  { key: "substanceUse", text: "I’m okay living with someone who drinks or uses cannabis." },
  { key: "noiseLevel", text: "I can tolerate noise and activity in shared spaces." },
  { key: "sharingPolicy", text: "I'm happy to share food and personal items with housemates." },
  { key: "conflictResolution", text: "I handle disagreements calmly and try to resolve them quickly." },
  { key: "communicationStyle", text: "I prefer open and direct communication with the people I live with." }
];

export default function Quiz() {
  const [responses, setResponses] = useState({});
  const [priorities, setPriorities] = useState({});
  const navigate = useNavigate();

  // Check for quiz information
  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.quizResponses) setResponses(res.data.quizResponses);
        if (res.data.priorityOrder) {
          const priorityMap = {};
          res.data.priorityOrder.forEach((key, i) => {
            priorityMap[key] = i + 1;
          });
          setPriorities(priorityMap);
        } else {
          const defaultPriorities = {};
          questions.forEach((q, i) => {
            defaultPriorities[q.key] = i + 1;
          });
          setPriorities(defaultPriorities);
        }
      } catch (err) {
        console.error("Error loading quiz data", err);
      }
    };
    fetchQuiz();
  }, []);
  
  //Handle updates to quiz
  const handleChange = (key, value) => {
    setResponses({ ...responses, [key]: value });
  };

  // Change pirorty numbers and order
  const handlePriorityChange = (key, value) => {
    const newPriorities = { ...priorities, [key]: parseInt(value) };
    setPriorities(newPriorities);
  };

  // Function to handle the submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const ordered = Object.entries(priorities)
        .sort(([, a], [, b]) => a - b)
        .map(([key]) => key);

      await axios.patch(
        "http://localhost:5000/api/auth/update-quiz",
        {
          quizResponses: responses,
          priorityOrder: ordered
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Quiz submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting quiz", err);
      alert("Something went wrong submitting the quiz.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        🧠 Compatibility Quiz
      </h2>
      <p style={{ marginBottom: "1rem", fontSize: "1rem" }}>
        Rate each factor from 1 (Strongly Disagree) to 5 (Strongly Agree) <br />
        and assign a priority number from <strong>1 (Most Important)</strong> to <strong>{questions.length} (Least Important)</strong>.
        </p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        {questions.map((q) => (
          <div
            key={q.key}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px"
            }}
          >
            <label>
              <strong>{q.text}</strong> (1–5):{" "}
              <input
                type="number"
                min="1"
                max="5"
                value={responses[q.key] || ""}
                onChange={(e) => handleChange(q.key, e.target.value)}
                style={{ width: "3rem", marginRight: "1rem" }}
              />
            </label>
            <label>
              Priority:{" "}
              <input
                type="number"
                min="1"
                max={questions.length}
                value={priorities[q.key] || ""}
                onChange={(e) => handlePriorityChange(q.key, e.target.value)}
                style={{ width: "3rem" }}
              />
            </label>
          </div>
        ))}

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.8rem 1.5rem",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
