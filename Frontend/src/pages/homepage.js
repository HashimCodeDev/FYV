import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const Logo = () => {
    return (
      <div className='logo-container'>
        <img
          className='logo'
          src='/external/logo.png'
          alt='FYV Logo'
        />
        <a className='logo-name'>FYV</a>
      </div>
    );
  };

  const NavBar = () => {
    return (
      <div className='navigation-bar'>
        <a className='about'> About </a>
        <a
          className='login'
          onClick={() => navigate('/login')}
          role='button'
          aria-label='Navigate to Login'>
          Login
        </a>
        <a className='contact'> Contact Us </a>
      </div>
    );
  };

  const GitHub = () => {
    return (
      <div className='github'>
        <a
          className='star-github'
          href='https://github.com/HashimCodeDev/FYV'
          target='_blank'
          rel='noopener noreferrer'>
          Star ⭐ Our Project
        </a>
      </div>
    );
  };

  const Heading = () => {
    return (
      <div className='heading'>
        <h1 className='main'> Link Up </h1>
        <h1 className='sub'>Connecting you, one chat at a time.</h1>
      </div>
    );
  };

  return (
    <div className='homepage-container'>
      <div className='header'>
        <Logo />
        <NavBar />
        <GitHub />
      </div>

      <div className='hero'>
        <Heading />
      </div>
    </div>
  );
};

export default Homepage;
