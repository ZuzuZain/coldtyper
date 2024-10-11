//Import React and useState, useEffect hooks
//useState is used to manage the state of user input and the timer
import React, { useState, useEffect, useRef } from 'react';
import './MainScreen.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const MainScreen = () => {
  const sentence = "the quick brown fox jumps over the lazy dog"; // The sentence that the user will type

  const [userInput, setUserInput] = useState(""); // Stores the user input
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the position within the sentence that the user is currently typing
  
  const [testDuration, setTestDuration] = useState(30); // Default test duration is 30 seconds
  const [timeLeft, setTimeLeft] = useState(null); // Timer state
  const [testActive, setTestActive] = useState(false); // Is the test active
  const [countdown, setCountdown] = useState(3); // Countdown before the test starts

  const navigate = useNavigate(); // Hook to navigate between pages
  const inputRef = useRef(null); //Used to make the cursor focus on the input field when the test starts

  // Function to start the countdown
  const startTest = () => {

    setTestActive(false); // Is the test active or not (Initially set to false)
    setUserInput(""); 
    setCurrentIndex(0);
    setCountdown(3); // Start a 3-second countdown

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setTestActive(true); // Start the actual  test
          setTimeLeft(testDuration); // Set timer based on the selected duration
          inputRef.current.focus();
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle timer countdown once the test starts
  useEffect(() => {
    let timerInterval;
    if (testActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTestActive(false); // Stop the test when the timer hits zero
    }
    return () => clearInterval(timerInterval);
  }, [testActive, timeLeft]);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value; //Value = user input character
    if (testActive && timeLeft > 0) {
      setUserInput(value);
      setCurrentIndex(value.length);
    }
    if (value === sentence) {
      setTestActive(false);
      setTimeLeft(0); // Set the timer to 0 to indicate the test is finished
    }
  };

  // Function to display the sentence with color coding
  const displaySentence = () => {
    const sentenceArray = sentence.split("").map((char, index) => {
      let color;
      if (index < currentIndex) {
        if (char === userInput[index]) {
          color = '#00E6F6'; // Blue color for correct characters
        } else {
          color = 'red'; // Green color for incorrect characters
        }
      }
      return (
        <span key={index} style={{ color: color, whiteSpace: 'pre' }}>
          {char}
        </span>
      );
    });
  
    // Insert cursor at the current index
    sentenceArray.splice(currentIndex, 0, (
      <span key="cursor" style={{ color: 'white', whiteSpace: 'pre' }}>|</span>
    ));
  
    return sentenceArray;
  };

  const handleGoBack = () => {
    navigate('/'); // Navigate back to the login page
  };

  // Handle the toggle between 30-second and 60-second test
  const handleTestDurationChange = (e) => {
    setTestDuration(Number(e.target.value));
  };

  return (
    <div className="MainScreen">

      <Header />

      <div className="MainScreen-body">

        <div class="duration-toggle">
          <input 
              type="radio" 
              id="rad1" 
              name="rads"
              value={30}
              checked={testDuration === 30}
              onChange={handleTestDurationChange}/>
          <label for="rad1">30 Seconds</label>
          <input 
              type="radio" 
              id="rad2" 
              name="rads"
              value={60}
              checked={testDuration === 60}
              onChange={handleTestDurationChange}/>
          <label for="rad2">60 Seconds</label>
        </div>
        {/* Start test button */}
        <button onClick={startTest} className="button-49" style={{ marginBottom: '20px' }}>
          Start Test
        </button>

        {/* Test start countdown */}
        {countdown > 0 && !testActive && <h2>Starting in: {countdown}</h2>}

        {/* Test duration timer*/}
        {testActive && <h2>Time Left: {timeLeft}s</h2>}
        {/* Typing test center div */}
        <div className="Mainscreen-content">
          <div className='WPM'>WPM:</div>
          <div className="centered-div" onClick={() => document.getElementById('hidden-input').focus()}>
            {displaySentence()}
            <input
              ref={inputRef}
              id="hidden-input"
              type="text"
              value={userInput}
              onChange={handleInputChange}
              autoFocus
              style={{ opacity: 0, position: 'absolute', left: '-9999px' }}
            />
          </div>
          <div className='Accuracy'>Accuracy:</div>
        </div>
        {/* Log-out button*/}
        <button onClick={handleGoBack} className="button-49" style={{ marginTop: '20px' }}>
          Go Back to Login
        </button>
      </div>
    </div>
  );
};

export default MainScreen;

//Frontend ToDo
  //Can do now
    //1. Add a feature to follow  WPM and accuracy during test
    //2. Add a feature to display the result after the test
  //Can partially work on
    //3. Make a global leaderboard to display the fastest users
    //4. Add an account screen to see the user's statistics
