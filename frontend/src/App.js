// Login/Main page for Coldtyper
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; //Responsible for routing (Or switching from page to page)
import MainScreen from './MainScreen';
import Header from './Header';
import SignUp from './SignUp';

function App() {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (event) => {
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Store the token in localStorage or a state management solution
      localStorage.setItem('token', data.token);
      navigate('/main');
    } else {
      // Handle login error
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
};

  return (
    <div className="App">

      <Header /> {/* Header component from Header.js/.css */}

      <div className="App-body">

        <div className="App-description"> {/* Left side of body; provides a description for what Coldtyper is */}
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

        <div className="App-login"> {/* Right side of body; login and signup sections */}
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
      <Route path="/" element={<App />} /> {/* Login page */}
      <Route path="/main" element={<MainScreen />} /> {/* Typing test page */}
      <Route path="/signup" element={<SignUp />} /> {/* Sign Up page */}
    </Routes>
  </Router>
);

export default AppWrapper;
