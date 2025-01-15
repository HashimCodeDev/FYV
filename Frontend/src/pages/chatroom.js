import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Helmet } from 'react-helmet';
import io from 'socket.io-client';
import { app, analytics } from '../firebase'; // Import Firebase

import '../styles/chatroom.css';

const Chatroom = () => {
  const [time, setTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socket = io('http://localhost:5000', {
    withCredentials: true,
  });

  // Timer for chat duration
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle incoming chat messages
  useEffect(() => {
    socket.on('chatMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [socket]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chatMessage', message);
      setMessage('');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(time + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle video state
  const toggleVideo = () => setVideoEnabled((prev) => !prev);

  // Toggle mic state
  const toggleMic = () => setMicEnabled((prev) => !prev);

  // Send message
  const sendMessage = () => {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: messageText, isUser: true },
      ]);
      messageInput.value = '';
    }
  };

  // Handle enter key press to send message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className='chatroom-container'>
      <div className='chatroom-header'>
        <div className='chatroom-logo'>
          <img
            className='logo'
            src='/external/logo.png'
          />
        </div>
        <div className='chatroom-title'>
          <h1>CHAT ROOM</h1>
          <a>{formatTime(time)}</a>
        </div>
      </div>
      <div className='chatroom-local-screen'></div>
      <div className='chatroom-remote-screen'></div>
    </div>
  );
};

export default Chatroom;
