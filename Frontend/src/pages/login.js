import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate fields
    if (!email.trim() || !password.trim()) {
      setError('Both email and password are required.');
      return;
    }

    // Clear error on successful validation
    setError('');
    // Redirect to the main screen
    window.location.href = '/main-screen-off';
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
            className='secondary-button'>
            <img
              src='/external/qrcode.png'
              alt='QR Code Icon'
              className='qr-icon'
            />
            Sign in with college ID card
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
