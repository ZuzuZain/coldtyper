// Imports necessary components and libraries for the app
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
          setCorrectChars(0);
          setAllTypedEntries(0);
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
    } else if (timeLeft === 0 && testActive) {
      setTestActive(false); // Stop the test when the timer hits zero
      calculateWpm();
      calculateAccuracy();
      localStorage.setItem('wpm', wpm);
      localStorage.setItem('accuracy', accuracy);
      sendTestResults(); // Send the test results to the backend
    }

    return () => clearInterval(timerInterval);
  }, [testActive, timeLeft, wpm, accuracy]);

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

  // Function to handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (testActive && timeLeft > 0) {
      const lastChar = value.slice(-1); // Get the last character typed

      // Count all valid typed characters, not including backspace and shift
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

  // Calculates the WPM with an adjusted formula (Divide by 5 because average word length is 5 characters)
  const calculateWpm = () => {
    const wordsPerMinute = (allTypedEntries / 5) / (testDuration / 60); // Adjusted WPM formula
    setWpm(wordsPerMinute);
  };

  // Calculates the user's accuracy
  const calculateAccuracy = () => {
    const accuracyPercentage = (correctChars / allTypedEntries) * 100; // Adjusted accuracy formula
    setAccuracy(accuracyPercentage.toFixed(2));
  };

  // Function to display the sentence with colors based on user input
  const displaySentence = () => {
    let absoluteIndex = 0; // Track index across entire sentence

    // Map over words and create spans for each word
    const wordsArray = sentence.split(" ").map((word, wordIndex) => {
        const wordCharacters = word.split("").map((char, charIndex) => {
            // Determine the color based on correctness
            let color;
            if (absoluteIndex < currentIndex) {
                color = char === userInput[absoluteIndex] ? '#00E6F6' : 'red';
            }

            const charSpan = (
                <span key={`${wordIndex}-${charIndex}`} style={{ color: color }}>
                    {char}
                </span>
            );
            
            absoluteIndex++; // Increment for each character in word
            return charSpan;
        });

        // Add a single space between words
        const wordWithSpace = (
            <span key={`word-${wordIndex}`} style={{ display: 'inline-block', marginRight: '4px' }}>
                {wordCharacters}
                {wordIndex < sentence.split(" ").length - 1 && (
                    <span>&nbsp;</span> // Add space only if not last word
                )}
            </span>
        );

        absoluteIndex++;
        return wordWithSpace;
  });

  // Return sentence with wrapping and spacing
  return (
      <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word', padding: '15px', fontSize: '25px' }}>
          {wordsArray}
      </div>
  );
};

// Function to handle logout
  const handleGoBack = async () => {
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

  const handleTestDurationChange = (e) => {
    setTestDuration(Number(e.target.value));
  };

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

  // Returns the HTML for the MainScreen component
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