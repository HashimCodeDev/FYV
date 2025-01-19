import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import io from 'socket.io-client';

import '../styles/lobby.css';
import axios from 'axios';

const MainScreenOFF = (props) => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const userId = localStorage.getItem('userId');
  const [loading, setLoading] = useState(false);

  //   const verifyToken = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://fyv-production.up.railway.app/api/auth/verify',
  //         {
  //           method: 'POST',
  //           headers: {
  //             authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({ token }),
  //         }
  //       );

  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.message || 'Token verification failed');
  //       }
  //     } catch (error) {
  //       console.error('Error verifying token:', error);
  //       navigate('/login');
  //     }
  //   };

  // React.useEffect(() => {
  //   if (token) {
  //     verifyToken();
  //   } else {
  //     navigate('/login');
  //   }
  // }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    navigate('/chatroom');
  };

  const handleSignOut = async (event) => {
    event.preventDefault();
    // localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='lobbyContainer'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='lobbyMainScreenOff'>
        <div className='lobbySidebar'>
          <div className='lobbyHeader'>
            <img
              src='/external/logo.png'
              alt='vibenoBmg13410'
              className='lobbyLogo'
            />
            <span className='lobbyTitle'>FYV</span>
          </div>
          <div className='lobbySettings'>
            <div className='lobbyMenuItem'>
              <img
                src='/external/settings3410-plui.svg'
                alt='settings3410'
                className='lobbySettingsIcon'
              />
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
              <div className='lobbyDuration'></div>
            </div>
            <div className='lobbyRight'></div>
          </div>
          <div className='lobbyContent'>
            <div className='lobbyVideoStream'>
              <div className='lobbyFrame'>
                <div className='lobbyFrameInner'>
                  <span className='lobbyNoVideoText'>
                    &quot;No active video calls at the moment.&quot;&quot;Ready
                    to connect? Click below to start fresh!&quot;
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
              src='/external/image26712-pg7j-200w.png'
              alt='image26712'
              className='lobbyProfileImage'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainScreenOFF;
