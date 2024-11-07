import Header from './Header';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  // Function to handle user signup
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const userData = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      username: event.target.username.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
  
    // Send a POST request to the backend to create the account
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        alert('Account created successfully!');
        navigate('/'); // Take the user back to the login page
      } else {
        alert('Failed to create account');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error creating account');
    }
  };
  

  return (
    <div className="signup-container">
    <Header />
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" className="button-49">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;