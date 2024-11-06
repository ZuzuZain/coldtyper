import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Statistics.css';
import Header from './Header';

const Statistics = () => {
  const [username, setUsername] = useState('User');
  const [fastestWpm, setFastestWpm] = useState(0);
  const [highestAccuracy, setHighestAccuracy] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  const navigate = useNavigate();

  // Fetch user statistics when the component loads
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/statistics', {
          method: 'GET',
          credentials: 'include', // Make sure cookies/sessions are included
        });

        if (response.ok) {
          const stats = await response.json();
          // Update state with the fetched statistics
          setUsername(stats.username || 'User'); // Assuming username is returned
          setFastestWpm(stats.fastest_wpm || 0);
          setHighestAccuracy(stats.highest_accuracy || 0);
          setTotalTests(stats.total_tests || 0);
        } else {
          console.error('Failed to fetch statistics:', await response.json());
        }
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