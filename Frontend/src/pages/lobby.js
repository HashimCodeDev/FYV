import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../styles/lobby.css';
import axios from 'axios';

const MainScreenOFF = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate('/chatroom');
  };

  const handleSignOut = async (event) => {
    event.preventDefault();
    navigate('/login');
  };

  const getUserDetails = async (event) => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/users/${userId}`);
      const data = response.data;
      console.log('User details:', data);

      // Handle user's status update from server
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className='lobbyContainer'>
      <div className='lobbyMainScreenOff'>
        <div className='lobbySidebar'>
          <div className='lobbyHeader'>
            <img
              src='/external/logo.png'
              alt='FYV Logo'
              className='lobbyLogo'
            />
          </div>
          <div className='lobbySettings'>
            <div className='lobbyMenuItem'>
              {/* <img
                src='/external/settings3410-plui.svg'
                alt='settings'
                className='lobbySettingsIcon'
              /> */}
              <button
                to='/login'
                onClick={handleSignOut}
                className='lobbySignOutButton'>
                Sign Out
              </button>
            </div>
          </div>
        </div>
        <div className='lobbyMain'>
          <div className='lobbyHeaderSecondary'>
            <div className='lobbyLeft'>
              <span className='lobbyLobbyText'>Lobby</span>
            </div>
            <div className='lobbyRight'></div>
          </div>
          <div className='lobbyContent'>
            <div className='lobbyVideoStream'>
              <div className='lobbyFrame'>
                <div className='lobbyFrameInner'>
                  <span className='lobbyNoVideoText'>
                    "Connect with the world, one vibe at a time."
                  </span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className='lobbyJoinButton'>
                <div className='lobbyMessage'>
                  <span className='lobbyJoinText'>JOIN A NEW ROOM</span>
                </div>
              </button>
              <div className='lobbyControls'>
                <div className='lobbyMiddle'></div>
                <div className='lobbyWrapper'></div>
              </div>
            </div>
          </div>
        </div>
        <div className='lobbyProfileLink'>
          <Link
            to='/profilesetting'
            className='lobbyProfileImage'>
            <img
              src='/external/profile.svg'
              alt='profile'
              className='lobbyProfileImage'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainScreenOFF;
