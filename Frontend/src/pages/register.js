import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/register.css';
import axios from 'axios';

const SignUpPage = () => {
  // State hooks for the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  // List of interests
  const allInterests = [
    'Music',
    'Art',
    'Poetry',
    'Dance',
    'Photography',
    'Cooking',
    'Reading',
    'Writing',
    'Traveling',
    'Technology',
    'Gaming',
    'Fitness',
    'Movies',
    'Yoga',
    'Nature',
    'Sports',
    'Fashion',
    'Animals',
    'Science',
    'Theater',
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        { name, email, password, interests },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      // Clear error on successful validation
      setError('');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      if (error.response && error.response.status === 400) {
        setError('User Already Exists!');
        return;
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }

    if (interests.length < 3) {
      setError('Please select atleast 3 interests!');
      return;
    }

    // Further form submission logic can go here, e.g., sending the data to a server.
    setError(''); // Clear any previous error
  };

  // Handle change in interests (select multiple)
  const handleInterestChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setInterests(value);
  };

  return (
    <div className='sign-up-container'>
      <Helmet>
        <title>Sign Up - FYV</title>
      </Helmet>

      <div className='sign-up-form-section'>
        <h1 className='form-title'>Create an Account</h1>

        <form
          className='sign-up-form'
          onSubmit={handleSubmit}>
          {/* Nickname Field */}
          <label className='form-label'>
            Nickname
            <input
              type='text'
              placeholder='Enter nickname'
              className='form-input'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          {/* Email Field */}
          <label className='form-label'>
            Email
            <input
              type='email'
              placeholder='Enter email'
              className='form-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password Field */}
          <label className='form-label'>
            Password
            <div className='password-wrapper'>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Create a password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type='button'
                className='toggle-password'
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label={
                  passwordVisible ? 'Hide password' : 'Show password'
                }>
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {/* Confirm Password Field */}
          <label className='form-label'>
            Confirm Password
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder='Confirm your password'
              className='form-input'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {/* Interests Dropdown */}
          <label className='form-label'>
            Select 3 Interests
            <div className='checkbox-group'>
              {allInterests.map((interest, index) => (
                <label
                  key={index}
                  className='checkbox-label'>
                  <input
                    type='checkbox'
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (e.target.checked) {
                        setInterests([...interests, value]); // Add the selected interest
                      } else {
                        setInterests(
                          interests.filter((item) => item !== value)
                        ); // Remove the deselected interest
                      }
                    }}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </label>

          {/* Inline Error Message */}
          {error && <div className='form-error'>{error}</div>}

          {/* Sign Up Button */}
          <button
            type='submit'
            className='primary-button'>
            Sign Up
          </button>

          {/* Already have an account link */}
          <div className='form-options'>
            <Link
              to='/login'
              className='login-link'>
              Already have an account? Login here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
