//Imports necessary components and libraries for the app
import React, { useState, useEffect, useRef } from 'react';
import './MainScreen.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const MainScreen = () => {

  // Sentence that the user will be typing
  const sentence = "the quick brown fox jumps over the lazy dog and these are other words that I am typing testing this more apple pear run jump test more this your ghost read red for the boat orange java girl type react ball jump run swing castle jon snow wars adventure galaxy whisper breeze horizon mystery cactus thunder eclipse velvet shadow ripple ember harmony twilight forest crystal melody ocean wander breeze summit cascade meadow sapphire storm labyrinth flicker oasis echo phoenix drizzle comet lunar wildfire dusk voyage infinity starlight shimmer"; // Sample sentence

  const [userInput, setUserInput] = useState(""); // Stores the user input
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the position within the sentence

  const [testDuration, setTestDuration] = useState(30); // Test duration; default = 30 seconds
  const [timeLeft, setTimeLeft] = useState(null); // Time remaining in test
  const [testActive, setTestActive] = useState(false); // Is the test active?
  const [countdown, setCountdown] = useState(3); // Countdown before the test starts

  const [wpm, setWpm] = useState(0); // Tracks WPM
  const [accuracy, setAccuracy] = useState(0); // Tracks accuracy
  const [correctChars, setCorrectChars] = useState(0); // Tracks the number of correct characters typed
  const [allTypedEntries, setAllTypedEntries] = useState(0); // Tracks all typed characters (excluding shifts/backspaces)

  const navigate = useNavigate();
  const inputRef = useRef(null);


// Function to start the test
  const startTest = () => {

    // Reset all the state variables
    setTestActive(false);
    setUserInput("");
    setCurrentIndex(0);
    setCorrectChars(0);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setTestActive(true);
          setAccuracy(0);
          setWpm(0);
          setTimeLeft(testDuration);
          inputRef.current.focus();
        }
        return prev - 1;
      });
    }, 1000);
  };


  // Function to send test results to the backend
const sendTestResults = async () => {
  try {
      const response = await fetch('http://localhost:5000/api/updateResults', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Include session credentials
          body: JSON.stringify({
              wpm: wpm, // WPM calculated after test
              accuracy: accuracy // Accuracy calculated after test
          }),
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


//Timing for the test
  useEffect(() => {
    let timerInterval;
    if (testActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTestActive(false); // Stop the test when the timer hits zero; then calculate WPM and accuracy
      calculateWpm();
      calculateAccuracy();
      sendTestResults(); // Send the test results to the backend
    }
    return () => clearInterval(timerInterval);
  }, [testActive, timeLeft]);


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


// Function to display the sentence with colors based on user input
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
    return <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', height:'100%', width:'100%', padding:'15px', fontSize: '25px' }}>{sentenceArray}</div>;
  };


// Function to handle logout
  const handleGoBack = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include', // Make sure cookies/sessions are included
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Redirect to login page on successful logout
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
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

  const handleMainClick = () => {
    navigate('/main'); // Navigate to the main page
  };


// HTML for the MainScreen component
  return (
    <div className="MainScreen">
      <Header />
      <div className="MainScreen-container">

        {/* Left sidebar with leaderboard button */}
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

          <button onClick={handleGoBack} className="sidebar-button">
            Logout
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