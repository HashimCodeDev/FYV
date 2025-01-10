import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className='homepage-container'>
      <div className='header'>
        <div className='logo-container'>
          <LazyLoadImage
            className='logo'
            src='/external/logo.png'
            alt='logo'
            effect='blur'
          />
          <a className='logo-name'>FYV</a>
        </div>
        <div className='navigation-bar'>
          <a className='about'> About </a>
          <a
            className='login'
            onClick={() => navigate('/login')}>
            Login
          </a>
          <a className='contact'> Contact Us </a>
        </div>

        <div className='github'>
          <a
            className='star-github'
            href='https://github.com/HashimCodeDev/FYV'
            target='_blank'
            rel='noopener noreferrer'>
            Star ⭐ Our Project
          </a>
        </div>
      </div>
      <div className='hero'>
        <div className='heading'>
          <h1 className='main'> Link Up </h1>
          <h1 className='sub'>Connecting you, one chat at a time</h1>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
