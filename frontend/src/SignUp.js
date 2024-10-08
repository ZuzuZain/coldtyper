import Header from './Header';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
  event.preventDefault();
  const username = event.target.username.value;
  const password = event.target.password.value;
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Account created successfully!');
      navigate('/');
    } else {
      alert('Registration failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
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
