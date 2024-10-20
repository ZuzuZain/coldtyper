import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';
import Header from './Header';
import axios from 'axios';

const Statistics = () => {
  const [username, setUsername] = useState('User');
  const [fastestWpm, setFastestWpm] = useState(0);
  const [highestAccuracy, setHighestAccuracy] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  const navigate = useNavigate();  // Initialize the navigate function

  // Fetch user statistics when the component loads
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics/1');  // Updated to point to user_id 1
        const data = response.data;

        // Assuming the returned data includes fastest_wpm, highest_accuracy, and total_tests fields
        setFastestWpm(data.fastest_wpm);
        setHighestAccuracy(data.highest_accuracy);
        setTotalTests(data.total_tests);
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="statistics-container">

      <Header />

        <button onClick={() => navigate('/main')} className="button-49">
          &#8592; {/* Left arrow symbol */}
        </button>

      <div className="statistics-content">
        <h1>User Statistics</h1>
        <h2>{username}</h2>
        <div className="stat">
          <label>Fastest WPM:</label>
          <span>{fastestWpm.toFixed(2)}</span>
        </div>
        <div className="stat">
          <label>Highest Accuracy:</label>
          <span>{highestAccuracy.toFixed(2)}%</span>
        </div>
        <div className="stat">
          <label>Total Tests Taken:</label>
          <span>{totalTests}</span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;