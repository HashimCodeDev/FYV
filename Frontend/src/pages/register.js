import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/register.css';
import axios from 'axios';
import { auth } from '../firebase'; // Adjust the path to match your file structure
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import Homepage from './homepage';

const SignUpPage = () => {
  // State hooks for the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState('');
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleCheckboxChange = (event) => {
    setIsPolicyChecked(event.target.checked); // Update state based on checkbox status
  };

  const handleChange = (e) => {
    // Get the selected options as an array
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    // Add the new selected options to the existing ones (without duplicating)
    setInterests((prevInterests) => {
      const updatedInterests = [...prevInterests];
      selectedOptions.forEach((option) => {
        if (!updatedInterests.includes(option)) {
          updatedInterests.push(option); // Add the new selected interest to the array
        }
      });
      return updatedInterests; // Update state with the new array
    });
  };
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

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Send verification email
      alert('Verification email has been sent to ' + user.email);
      await sendEmailVerification(user).then(async () => {
        const verificationEmail = await axios.post(
          `${apiUrl}/api/auth/verify`,
          { email },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Verification email sent successfully');
        setError(''); // Clear any previous error
        navigate('/login');
      });
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
      <div className='overlay'></div>
      <div className='login-background'>
        <Homepage />
      </div>
      <div className='sign-up-form-section'>
        <h1 className='form-title'>Create an Account</h1>

        <form
          className='sign-up-form'
          onSubmit={handleSubmit}>
          {/* Nickname Field */}
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

          {/* Email Field */}
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

          {/* Password Field */}
          <label className='register-label'>
            Password
            <div className='password-wrapper'>
              <input
                type='password'
                placeholder='Create a password'
                className='form-input'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>

          {/* Confirm Password Field */}
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

          <div className='policy'>
            <input
              id='policy-checkbox'
              type='checkbox'
              checked={isPolicyChecked}
              onChange={handleCheckboxChange}></input>
            By signing up, you agree to our
            <a
              href='https://example.com/terms-of-service'
              target='_blank'
              rel='noopener noreferrer'>
              Terms of Service
            </a>
            and
            <a
              href='https://example.com/privacy-policy'
              target='_blank'
              rel='noopener noreferrer'>
              Privacy Policy
            </a>
          </div>

          {/* Already have an account link */}
          <div className='form-options'>
            {/* Sign Up Button */}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
