"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import "./MainScreen.css";

export default function MainScreen() {
  const [state, setState] = useState({
    text: "",
    userInput: "",
    testDuration: 30,
    timeLeft: null,
    testActive: false,
    wpm: 0,
    accuracy: 0,
    difficulty: "medium",
  });

  const inputRef = useRef(null);
  const navigate = useNavigate();


  const fetchTestText = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/generate-text`,
        {
          params: { difficulty: state.difficulty, wordCount: 100 },
        }
      );
      setState((prev) => ({ ...prev, text: response.data.text }));
    } catch (error) {
      console.error("Error fetching test text:", error);
      setState((prev) => ({
        ...prev,
        text: "Error loading text. Please try again.",
      }));
    }
  };

  useEffect(() => {
    fetchTestText();
  }, [state.difficulty]);

  const startTest = () => {
    setState((prev) => ({
      ...prev,
      testActive: true,
      userInput: "",
      timeLeft: prev.testDuration,
      wpm: 0,
      accuracy: 0,
    }));
    fetchTestText();
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Inside the useEffect where WPM and accuracy are calculated
useEffect(() => {
  let timerInterval;
  if (state.testActive && state.timeLeft > 0) {
    timerInterval = setInterval(() => {
      setState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
    }, 1000);
  } else if (state.timeLeft === 0 && state.testActive) {
    const words = state.userInput.trim().split(" ").length;
    const characters = state.userInput.length;

    // Avoid division by zero if userInput is empty
    const correctCharacters = characters > 0
      ? state.text
          .slice(0, characters)
          .split("")
          .filter((char, index) => char === state.userInput[index]).length
      : 0;

    const wpm = ((words / state.testDuration) * 60).toFixed(2);
    const accuracy = characters > 0
      ? ((correctCharacters / characters) * 100).toFixed(2)
      : 0; // Set accuracy to 0 if no characters were typed

    // Store WPM and accuracy in localStorage
    localStorage.setItem("wpm", wpm);
    localStorage.setItem("accuracy", accuracy);

    setState((prev) => ({
      ...prev,
      testActive: false,
      wpm,
      accuracy,
    }));

    // Save results to the database
    sendTestResults();
  }
  return () => clearInterval(timerInterval);
}, [state.testActive, state.timeLeft]);

  

  const displayText = () => {
    let absoluteIndex = 0; // Track index across the entire sentence

    // Ensure state.text contains the sentence from the API
    const wordsArray = state.text.split(" ").map((word, wordIndex) => {
        const wordCharacters = word.split("").map((char, charIndex) => {
            // Determine the color based on correctness
            let color = "inherit";
            if (absoluteIndex < state.userInput.length) {
                color = char === state.userInput[absoluteIndex] ? "#00E6F6" : "red";
            }

            const charSpan = (
                <span key={`${wordIndex}-${charIndex}`} style={{ color: color }}>
                    {char}
                </span>
            );

            absoluteIndex++; // Increment for each character in the word
            return charSpan;
        });

        // Add a single space after each word except the last one
        const wordWithSpace = (
            <span key={`word-${wordIndex}`} style={{ display: "inline-block", marginRight: "4px" }}>
                {wordCharacters}
                {wordIndex < state.text.split(" ").length - 1 && (
                    <span>&nbsp;</span> // Add space only if not the last word
                )}
            </span>
        );

        absoluteIndex++; // Increment for the space between words
        return wordWithSpace;
    });

    return <div>{wordsArray}</div>;
};

  // Function to send test results to the backend
  const sendTestResults = async () => {
    try {
      // Retrieve WPM and accuracy from localStorage
      const storedWpm = localStorage.getItem('wpm');
      const storedAccuracy = localStorage.getItem('accuracy');

      // If the values exist in localStorage, use them
      if (!storedWpm || !storedAccuracy) {
        console.error('WPM or accuracy not found in localStorage');
        return;
      }

      // Log the values to verify they're being retrieved correctly
      console.log('Submitting results:', { wpm: storedWpm, accuracy: storedAccuracy });

      // Send the results to the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/updateResults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session credentials
        body: JSON.stringify({
          wpm: storedWpm, // WPM retrieved from localStorage
          accuracy: storedAccuracy, // Accuracy retrieved from localStorage
        }, 
      { withCredentials: true}),
      });

      if (response.ok) {
        console.log('Results submitted successfully');
      } else {
        console.error('Failed to submit results');
      }
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

    // Refresh the page when the user presses Enter for quick restart
    useEffect(() => {
      const handleEnterPress = (event) => {
          if (event.key === "Enter") {
              localStorage.removeItem('wpm');
              localStorage.removeItem('accuracy');
              window.location.reload(); // Refresh the page
          }
      };
      window.addEventListener("keydown", handleEnterPress);
      return () => {
          window.removeEventListener("keydown", handleEnterPress);
      };
    }, []);

  // Navigate to Leaderboard page
  const handleLeaderboardClick = () => {
    navigate('/leaderboard'); 
  };

  const handleStatisticsClick = () => {
    navigate('/statistics');
  };

  const handleMainClick = () => {
    navigate('/main');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // Make sure cookies/sessions are included
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page on successful logout
        localStorage.removeItem('wpm');
        localStorage.removeItem('accuracy');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      userInput: value,
    }));
  };  

  return (
    <div className="MainScreen">
      <Header />
      <div className="MainScreen-container">
      <nav className="sidebar">
          
          <button onClick={handleMainClick} className="sidebar-button">
            Main Menu
          </button>

          <button onClick={handleLeaderboardClick} className="sidebar-button">
            Leaderboard
          </button>

          <button onClick={handleStatisticsClick} className="sidebar-button">
            User Statistics
          </button>

          <button onClick={handleLogout} className="sidebar-button">
            Logout
          </button>
          
        </nav>

        <div className="MainScreen-body">
          <div className="duration-toggle">
            {[30, 60].map((duration) => (
              <React.Fragment key={duration}>
                <input
                  type="radio"
                  id={`rad${duration === 30 ? 1 : 2}`}
                  name="rads"
                  value={duration}
                  checked={state.testDuration === duration}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      testDuration: Number(e.target.value),
                    }))
                  }
                />
                <label htmlFor={`rad${duration === 30 ? 1 : 2}`}>
                  {duration} Seconds
                </label>
              </React.Fragment>
            ))}
          </div>

          <div className="difficulty-toggle">
            <select
              value={state.difficulty}
              onChange={(e) =>
                setState((prev) => ({ ...prev, difficulty: e.target.value }))
              }
            >
              {["easy", "medium", "hard"].map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={startTest}
            className="button-49"
            style={{ marginBottom: "20px" }}
          >
            Start Test
          </button>

          {state.testActive && <h2>Time Left: {state.timeLeft}s</h2>}

          <div className="Mainscreen-content">
            <div className="centered-div text-container">{displayText()}</div>
            <input
              ref={inputRef}
              type="text"
              value={state.userInput}
              onChange={handleInputChange}
              disabled={!state.testActive}
              className="hidden-input"
            />
          </div>
          <div className="WPM">WPM: {state.wpm}</div>
          <div className="Accuracy">Accuracy: {state.accuracy}%</div>
        </div>
      </div>
    </div>
  );
}