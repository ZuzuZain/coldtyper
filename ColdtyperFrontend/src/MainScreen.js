import React, { useState, useEffect, useRef } from 'react';
import './MainScreen.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {
  const sentence = "the quick brown fox jumps over the lazy dog and these are other words that I am typing testing this more apple pear run jump test more this your ghost read red for the boat orange java girl type react ball jump run swing castle jon snow wars"; // Sample sentence

  const [userInput, setUserInput] = useState(""); // Stores the user input
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the position within the sentence that the user is currently typing

  const [testDuration, setTestDuration] = useState(30); // Default test duration is 30 seconds
  const [timeLeft, setTimeLeft] = useState(null); // Timer state
  const [testActive, setTestActive] = useState(false); // Is the test active
  const [countdown, setCountdown] = useState(3); // Countdown before the test starts

  const [wpm, setWpm] = useState(0); // Tracks WPM
  const [accuracy, setAccuracy] = useState(0); // Tracks accuracy
  const [correctChars, setCorrectChars] = useState(0); // Tracks the number of correct characters typed
  const [allTypedEntries, setAllTypedEntries] = useState(0); // Tracks all typed characters (excluding shifts/backspaces)

  const navigate = useNavigate();
  const inputRef = useRef(null);

  const startTest = () => {
    setTestActive(false); // Reset test active state
    setUserInput("");
    setCurrentIndex(0);
    setCorrectChars(0);
    setCountdown(3); // Start a 3-second countdown

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setTestActive(true); // Start the actual test
          setAccuracy(0);
          setWpm(0);
          setTimeLeft(testDuration); // Set timer based on the selected duration
          inputRef.current.focus();
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    let timerInterval;
    if (testActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTestActive(false); // Stop the test when the timer hits zero
      calculateWpm();
      calculateAccuracy();
    }
    return () => clearInterval(timerInterval);
  }, [testActive, timeLeft]);

  // Function to handle input changes
  // Function to handle input changes
const handleInputChange = (e) => {
  const value = e.target.value;
  if (testActive && timeLeft > 0) {
    const lastChar = value.slice(-1); // Get the last character typed

    // Count all valid typed characters excluding backspace and shift
    if (lastChar !== 'Shift' && lastChar !== 'Backspace') {
      setAllTypedEntries(allTypedEntries + 1);
    }

    setUserInput(value);
    setCurrentIndex(value.length);

    // Count correct characters
    let correctCharCount = 0;
    value.split("").forEach((char, index) => {
      if (char === sentence[index]) {
        correctCharCount++;
      }
    });
    setCorrectChars(correctCharCount);
  }
};

// Function to calculate WPM (words per minute)
const calculateWpm = () => {
  const wordsPerMinute = (allTypedEntries / 5) / (testDuration / 60); // Adjusted WPM formula
  setWpm(wordsPerMinute);
};

// Function to calculate accuracy
const calculateAccuracy = () => {
  const accuracyPercentage = (correctChars / allTypedEntries) * 100; // Adjusted accuracy formula
  setAccuracy(accuracyPercentage.toFixed(2));
};

  const displaySentence = () => {
    const sentenceArray = sentence.split("").map((char, index) => {
      let color;
      if (index < currentIndex) {
        if (char === userInput[index]) {
          color = '#00E6F6'; // Blue color for correct characters
        } else {
          color = 'red'; // Red color for incorrect characters
        }
      }
      return (
        <span key={index} style={{ color: color, whiteSpace: 'pre' }}>
          {char}
        </span>
      );
    });
    sentenceArray.splice(currentIndex, 0, (
      <span key="cursor" style={{ color: 'white', whiteSpace: 'pre' }}>|</span>
    ));
    return <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', height:'100%', width:'100%', padding:'15px' }}>{sentenceArray}</div>;
  };

  const handleGoBack = () => {
    navigate('/'); 
  };

  const handleTestDurationChange = (e) => {
    setTestDuration(Number(e.target.value));
  };

  // Navigate to Leaderboard page
  const handleLeaderboardClick = () => {
    navigate('/leaderboard'); 
  };

  const handleStatisticsClick = () => {
    navigate('/statistics'); // Navigate to the statistics page
  };

  return (
    <div className="MainScreen">
      <Header />
      <div className="MainScreen-container">

        {/* Left sidebar with leaderboard button */}
        <nav className="sidebar">
          
          <button onClick={handleGoBack} className="sidebar-button">
            Logout
          </button>

          <button onClick={handleLeaderboardClick} className="sidebar-button">
            Leaderboard
          </button>

          <button onClick={handleStatisticsClick} className="sidebar-button">
            User Statistics
          </button>
        </nav>

        <div className="MainScreen-body">
          <div className="duration-toggle">
            <input 
                type="radio" 
                id="rad1" 
                name="rads"
                value={30}
                checked={testDuration === 30}
                onChange={handleTestDurationChange}/>
            <label htmlFor="rad1">30 Seconds</label>
            <input 
                type="radio" 
                id="rad2" 
                name="rads"
                value={60}
                checked={testDuration === 60}
                onChange={handleTestDurationChange}/>
            <label htmlFor="rad2">60 Seconds</label>
          </div>

          <button onClick={startTest} className="button-49" style={{ marginBottom: '20px' }}>
            Start Test
          </button>

          {countdown > 0 && !testActive && <h2>Starting in: {countdown}</h2>}
          {testActive && <h2>Time Left: {timeLeft}s</h2>}

          <div className="Mainscreen-content">
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
          </div>
          <div className='WPM'>WPM: {wpm.toFixed(2)}</div>
          <div className='Accuracy'>Accuracy: {accuracy}%</div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;