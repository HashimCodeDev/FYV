import React from 'react';
import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import '../styles/lobby.css';

const MainScreenOFF = (props) => {
  return (
    <div className='lobby-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='lobby-main-screen-off'>
        <div className='lobby-sidebar'>
          <div className='lobby-header1'>
            <img
              src='/external/fyv_nobmg.png'
              alt='vibenoBmg13410'
              className='lobby-vibeno-bmg1'
            />
            <span className='lobby-text1'>FYV</span>
          </div>
          <div className='lobby-settings1'>
            <div className='lobby-menu-item'>
              <img
                src='/external/settings3410-plui.svg'
                alt='settings3410'
                className='lobby-settings2'
              />
              <Link
                to='/'
                className='lobby-text2 Title'>
                Sign Out
              </Link>
            </div>
          </div>
        </div>
        <div className='lobby-main'>
          <div className='lobby-header2'>
            <div className='lobby-left'>
              <span className='lobby-text3'>Lobby</span>
              <div className='lobby-duration'></div>
            </div>
            <div className='lobby-right'></div>
          </div>
          <div className='lobby-content'>
            <div className='lobby-video-stream'>
              <div className='lobby-frame28991'>
                <div className='lobby-frame28992'>
                  <span className='lobby-text4'>
                    &quot;No active video calls at the moment.&quot;&quot;Ready
                    to connect? Click below to start fresh!&quot;
                  </span>
                </div>
              </div>
              <Link
                to='/Chatroom'
                className='lobby-navlink1'>
                <div className='lobby-message'>
                  <span className='lobby-text5'>JOIN A NEW ROOM</span>
                </div>
              </Link>
              <div className='lobby-controls'>
                <div className='lobby-middle'></div>
                <div className='lobby-wrapper'></div>
              </div>
            </div>
          </div>
        </div>
        <div className='lobby-frame28993'>
          <Link
            to='/profilesetting'
            className='lobby-navlink2'>
            <img
              src='/external/image26712-pg7j-200w.png'
              alt='image26712'
              className='lobby-image2'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainScreenOFF;
