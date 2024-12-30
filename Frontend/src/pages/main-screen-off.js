import React from 'react';
import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import '../styles/main-screen-off.css';

const MainScreenOFF = (props) => {
  return (
    <div className='main-screen-off-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='main-screen-off-main-screen-off'>
        <div className='main-screen-off-sidebar'>
          <div className='main-screen-off-header1'>
            <img
              src='/external/vibenobmg13410-eygl-200w.png'
              alt='vibenoBmg13410'
              className='main-screen-off-vibeno-bmg1'
            />
            <span className='main-screen-off-text1'>FYV</span>
          </div>
          <div className='main-screen-off-settings1'>
            <div className='main-screen-off-menu-item'>
              <img
                src='/external/settings3410-plui.svg'
                alt='settings3410'
                className='main-screen-off-settings2'
              />
              <Link
                to='/profilesetting'
                className='main-screen-off-text2 Title'>
                Settings
              </Link>
            </div>
          </div>
        </div>
        <div className='main-screen-off-main'>
          <div className='main-screen-off-header2'>
            <div className='main-screen-off-left'>
              <span className='main-screen-off-text3'>Lobby</span>
              <div className='main-screen-off-duration'></div>
            </div>
            <div className='main-screen-off-right'></div>
          </div>
          <div className='main-screen-off-content'>
            <div className='main-screen-off-video-stream'>
              <div className='main-screen-off-frame28991'>
                <div className='main-screen-off-frame28992'>
                  <span className='main-screen-off-text4'>
                    &quot;No active video calls at the moment.&quot;&quot;Ready
                    to connect? Click below to start fresh!&quot;
                  </span>
                </div>
              </div>
              <Link
                to='/main-screen-on'
                className='main-screen-off-navlink1'>
                <div className='main-screen-off-message'>
                  <span className='main-screen-off-text5'>JOIN A NEW ROOM</span>
                </div>
              </Link>
              <div className='main-screen-off-controls'>
                <div className='main-screen-off-middle'></div>
                <div className='main-screen-off-wrapper'></div>
              </div>
            </div>
          </div>
        </div>
        <div className='main-screen-off-frame28993'>
          <Link
            to='/profilesetting'
            className='main-screen-off-navlink2'>
            <img
              src='/external/image26712-pg7j-200w.png'
              alt='image26712'
              className='main-screen-off-image2'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainScreenOFF;
