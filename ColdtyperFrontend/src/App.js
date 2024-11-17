// Imports necessary components and libraries for the app
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainScreen from './MainScreen';
import Header from './Header';
import SignUp from './SignUp';
import Statistics from './Statistics';
import Leaderboard from './Leaderboard';

function App() {
  const navigate = useNavigate();

  // Handles user login functionality
  const handleLogin = async (event) => {
    event.preventDefault();
    
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        // Send POST request to backend for login with credentials
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password }, {
            withCredentials: true, //Sends the users cookie with the request
        });
        
        // If login is successful, redirect to main screen
        if (response.status === 200) {
            localStorage.setItem('userId', response.data.user.id); // Store the user ID in local storage
            navigate('/main');
        }
    } catch (error) {
        // Catches any potential errors and alerts the user (Wrong password, user not found, etc.)
        console.error('Login failed:', error.response ? error.response.data : error);
        alert('Login failed: ' + (error.response ? error.response.data.error : 'Unknown error'));
    }
    console.log('Setting cookie:', res.getHeader('Set-Cookie'));  // Log the cookie
  res.send('Login successful');
};

// Navigates to Signup Page on button press
  const handleSignUp = () => {
    navigate('/signup');
  };

// Returns the HTML for the App page
  return (
    <div className="App">

      <Header />

      <div className="App-body">

        <div className="App-description">
          <h1>What is Coldtyper?</h1>
          <div className="card">
            <div className="inner-card">Coldtyper is a typing test app that allows users to test their typing speed and accuracy. Once a test begins, the app will keep track of user's time, WPM, and accuracy. Once the test is over, users can view their results.</div>
            
          </div>
          <div className="card">
            <div className="inner-card">Create a Coldtyper account to track your typing progress over time. View statistics and grpahs that show how your typing has improved from test to test.</div>
        
          </div>
          <div className="card">
            <div className="inner-card">Want to know how your WPM stacks up to your friends? View the global leaderboard to view the ranking of the fastest Coldtyper users.</div>
            
          </div>
        </div>

        <div className="App-login">
          <div className="login-section">
            <h1>Already Have an Account?</h1>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className="button-49">Login</button>
            </form>
          </div>

          <div className="signup-section">
            <h1>New User?</h1>
            <button type="button" className="button-49" onClick={handleSignUp}>Sign Up</button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Router wrapper to handle navigation
const AppWrapper = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} /> {/* App */}
      <Route path="/main" element={<MainScreen />} /> {/* MainScreen */}
      <Route path="/signup" element={<SignUp />} /> {/* SignUp */}
      <Route path="/statistics" element={<Statistics />} /> {/* Statistics */}
      <Route path="/leaderboard" element={<Leaderboard />} /> {/* Leaderboard */}
    </Routes>
  </Router>
);

export default AppWrapper;