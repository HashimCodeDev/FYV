import React, { useState } from 'react';
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

  const Emoticons = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
      // Update the position based on mouse movement
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Get the emoticons container
      const emoticonsContainer = document.querySelector('.emoticons');

      // Calculate the movement of the container based on the mouse position
      const diffX = mouseX - window.innerWidth / 2; // Move based on the difference from the center
      const diffY = mouseY - window.innerHeight / 2; // Move based on the difference from the center

      // Apply the movement to the container and move gifs inside it
      emoticonsContainer.style.transform = `translate(
      ${diffX / 20}px, 
      ${diffY / 20}px)`;
    };

    return (
      <div
        className='emoticon-container'
        onMouseMove={handleMouseMove}>
        <div
          className='emoticons'
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}>
          <img
            className='cool'
            src='/external/cool.gif'
          />
          <img
            className='lol'
            src='/external/lol.gif'
          />
          <img
            className='messages'
            src='/external/messages.gif'
          />
          <img
            className='happy'
            src='/external/happy.gif'
          />
        </div>
      </div>
    );
  };

  const Languages = () => {
    return (
      <div className='languages'>
        <h2>BUILT WITH: </h2>
        <img
          className='react'
          src='/external/react-js.svg'
        />
        <img
          className='node'
          src='/external/node-js.svg'
        />
        <img
          className='express'
          src='/external/express-js.svg'
        />
        <img
          className='firestore'
          src='/external/firestore.svg'
        />
      </div>
    );
  };

  return (
    <div className='homepage-container'>
      <Emoticons />
      <div className='header'>
        <Logo />
        <NavBar />
        <GitHub />
      </div>

      <div className='hero'>
        <Heading />
      </div>

      <div className='language-container'>
        <Languages />
      </div>
    </div>
  );
};

export default Homepage;
