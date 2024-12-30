import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../styles/homepage.css';

const Homepage = () => {
  return (
    <div className='homepage-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <header className='homepage-header'>
        {' '}
        {/* Use semantic header element */}
        <img
          src='/external/fyv_nobmg.png'
          alt='FYV Logo'
          className='homepage-logo'
        />
        <nav className='homepage-nav'>
          {' '}
          {/* Use semantic nav element */}
          <Link
            to='/login'
            className='homepage-login-link'>
            <img
              src='/external/login1617-lpx6m.svg'
              alt='Login Icon'
              className='homepage-login-icon'
            />
            <span className='homepage-login-text'>LOGIN</span>
          </Link>
        </nav>
      </header>
      <main className='homepage-main'>
        {' '}
        {/* Use semantic main element */}
        <div className='homepage-hero'>
          <img
            src='/external/image43412-r2er-1000h.png'
            alt='Hero Image'
            className='homepage-hero-image'
          />
          <div className='homepage-hero-overlay'>
            {' '}
            {/* Overlay for text */}
            <h1 className='homepage-hero-text'>
              {' '}
              {/* Use a heading element */}
              "Socializing is the art of finding the beauty in connections—
              <br />
              where strangers become friends and conversations become memories."
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
