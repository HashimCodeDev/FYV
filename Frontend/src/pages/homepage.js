import React from 'react';
import { Link } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import '../styles/homepage.css';

const Homepage = (props) => {
  return (
    <div className='homepage-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='homepage-homepage'>
        <div className='homepage-content'>
          <div className='homepage-page'>
            <div className='homepage-home-upper'>
              <div className='homepage-frame28988'>
                <img
                  src='/external/image43412-r2er-1000h.png'
                  alt='image43412'
                  className='homepage-image4'
                />
                <img
                  src='/external/rectangle4749560-tzhc-200h.png'
                  alt='Rectangle4749560'
                  className='homepage-rectangle474'
                />
                <span className='homepage-text1'>
                  <span>
                    &quot;Socializing is the art of finding the beauty in
                    connections—
                  </span>
                  <br></br>
                  <span>
                    where strangers become friends and conversations become
                    memories.&quot;
                  </span>
                </span>
                <Link
                  to='/login'
                  className='homepage-navlink'>
                  <img
                    src='/external/login1617-lpx6m.svg'
                    alt='login1617'
                    className='homepage-login'
                  />
                </Link>
                <Link
                  to='/login'
                  className='homepage-text5'>
                  LOGIN
                </Link>
                <img
                  src='/external/vibenobmg11617-6qz7-200h.png'
                  alt='vibenoBmg11617'
                  className='homepage-vibeno-bmg1'
                />
              </div>
            </div>
            <div className='homepage-controls'>
              <div className='homepage-wrapper'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
