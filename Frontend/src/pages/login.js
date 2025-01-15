import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../styles/login.css';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate fields
    if (!email.trim() || !password.trim()) {
      setError('Both email and password are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      // Clear error on successful validation
      setError('');

      localStorage.setItem('token', response.data.JwtToken);

      // Connect to WebSocket server
      const socket = io('http://localhost:5000', {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server:', socket.id);
      });

      // Redirect to the main screen
      navigate('/lobby');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 400) {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleCollegeIdSignIn = () => {
    navigate('/scanid');
  };

  return (
    <div className='login-container'>
      <Helmet>
        <title>Login - FYV</title>
      </Helmet>

      <div className='login-image-section'>
        <img
          src='/external/loginpage16363-yf5-900w.png'
          alt='Login Illustration'
          className='login-image'
        />
      </div>

      <div className='login-form-section'>
        <h1 className='form-title'>Nice to see you again</h1>

        <form
          className='login-form'
          onSubmit={handleSubmit}>
          {/* Email Field */}
          <label className='form-label'>
            Email
            <input
              type='email'
              placeholder='Enter email'
              className='form-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {/* Password Field */}
          <label className='form-label'>
            Password
            <div className='password-wrapper'>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Enter password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Inline Error Message */}
          {error && <div className='form-error'>{error}</div>}

          {/* Form Options */}
          <div className='form-options'>
            <label className='remember-me'>
              <input type='checkbox' />
              Remember me
            </label>
            <Link
              to='/forgot-password'
              className='forgot-password'>
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type='submit'
            className='primary-button'>
            Sign in
          </button>

          {/* Sign In with ID */}
          <button
            type='button'
            className='secondary-button'
            onClick={handleCollegeIdSignIn}>
            <img
              src='/external/qrcode.png'
              alt='QR Code Icon'
              className='qr-icon'
            />
            Sign in with college ID card
          </button>
        </form>
        <div className='registerButton'><a>New Here</a>
        <Link to='/register'>Register</Link>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
