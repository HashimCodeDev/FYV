import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/register.css';
import axios from 'axios';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import Homepage from './homepage';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState('');

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setUserId(response.data.userId);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      alert('Verification email has been sent to ' + user.email);
      await sendEmailVerification(user);

      setError('');
      setShowModal(true); // Show the modal for interests
    } catch (error) {
      console.error('Register error:', error);
      if (error.response?.status === 400) {
        setError('User Already Exists!');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleInterestSelection = (e) => {
    const value = e.target.value;
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleModalSubmit = async () => {
    if (interests.length < 3) {
      setError('Please select at least 3 interests!');
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/api/auth/interests`,
        { userId, interests },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setShowModal(false); // Close the modal
      navigate('/login'); // Redirect to login
    } catch (error) {
      console.error('Interest submission error:', error);
    }
  };

  return (
    <div className='sign-up-container'>
      <div className='overlay'></div>
      <div className='login-background'>
        <Homepage />
      </div>
      {!showModal && (
        <div className='sign-up-form-section'>
          <h1 className='form-title'>Create an Account</h1>
          <form
            className='sign-up-form'
            onSubmit={handleSubmit}>
            <label className='register-label'>
              User Name
              <input
                type='text'
                placeholder='Enter username'
                className='form-input'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className='register-label'>
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
            <label className='register-label'>
              Password
              <input
                type='password'
                placeholder='Create a password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label className='register-label'>
              Confirm Password
              <input
                type='password'
                placeholder='Confirm your password'
                className='form-input'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            {error && <div className='form-error'>{error}</div>}
            <div className='policy'>
              <input
                id='policy-checkbox'
                type='checkbox'
                checked={isPolicyChecked}
                onChange={(e) => setIsPolicyChecked(e.target.checked)}
              />
              By signing up, you agree to our{' '}
              <a
                href='https://example.com/terms-of-service'
                target='_blank'
                rel='noopener noreferrer'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='https://example.com/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'>
                Privacy Policy
              </a>
            </div>
            <button
              disabled={!isPolicyChecked}
              type='submit'
              className='sign-up'>
              Sign Up
            </button>
            <Link
              to='/login'
              className='login-link'>
              Already have an account? Login here.
            </Link>
          </form>
        </div>
      )}

      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <div className='heading'>
              <h2>Select Your Interests</h2>
            </div>
            <div className='checkbox-group'>
              {allInterests.map((interest, index) => (
                <label
                  key={index}
                  className='checkbox-label'>
                  <input
                    type='checkbox'
                    value={interest}
                    checked={interests.includes(interest)}
                    onChange={handleInterestSelection}
                  />
                  {interest}
                </label>
              ))}
            </div>
            <button
              onClick={handleModalSubmit}
              className='modal-submit'>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
