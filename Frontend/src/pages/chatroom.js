import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Helmet } from 'react-helmet';

import '../styles/chatroom.css';

const Chatroom = () => {
  const [time, setTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [messages, setMessages] = useState([]);

  // Timer for chat duration
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // Scroll to the latest message
  useEffect(() => {
    const messageHistory = document.getElementById('message-history');
    messageHistory.scrollTop = messageHistory.scrollHeight;
  }, [messages]);

  // Handle enter key press to send message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className='chatroom-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='chatroom-main'>
        {/* Sidebar */}
        <div className='chatroom-sidebar'>
          <div className='chatroom-header'>
            <img
              src='/external/fyv_nobmg.png'
              alt='FYV logo'
              className='chatroom-logo'
            />
            <span className='chatroom-title'>FYV</span>
          </div>
        </div>

        {/* Main content */}
        <div className='chatroom-content'>
          {/* Header */}
          <div className='chatroom-header'>
            <div className='chatroom-left'>
              <span className='chatroom-chatroom'>Chatroom</span>
              <div className='chatroom-duration'>
                <span className='chatroom-time'>({formatTime(time)})</span>
              </div>
            </div>
            <div className='chatroom-right'>
              <div className='chatroom-next-room'>
                <span className='chatroom-next-room-text'>
                  Next room (Spacebar)
                </span>
                <img
                  src='/external/arrowforwardi424-faqf.svg'
                  alt='Next room'
                  className='chatroom-next-room-icon'
                />
              </div>
              <img
                src='/external/morevertical4246-xt6.svg'
                alt='More options'
                className='chatroom-more-options'
              />
            </div>
          </div>

          {/* Content */}
          <div className='chatroom-main-content'>
            {/* Video Stream */}
            <div className='chatroom-video-stream'>
              <div className='chatroom-camera'>
                <div className='chatroom-video-controls'>
                  <span className='chatroom-video-disabled'>
                    Video disabled
                  </span>
                  <img
                    src='/external/eyeoff4254-1zar.svg'
                    alt='Video disabled icon'
                    className='chatroom-video-disabled-icon'
                  />
                </div>
              </div>
              <div className='chatroom-camera'>
                {videoEnabled && (
                  <Webcam
                    audio={micEnabled}
                    mirrored
                    className='chatroom-webcam'
                  />
                )}
              </div>
              <div className='chatroom-controls'>
                <div className='chatroom-middle-controls'>
                  <div
                    className='chatroom-video-toggle'
                    onClick={toggleVideo}>
                    <img
                      src={
                        videoEnabled
                          ? '/external/videoon.svg'
                          : '/external/videooff.svg'
                      }
                      alt='Video toggle'
                      className='chatroom-video-icon'
                    />
                  </div>
                  <div
                    className='chatroom-mic-toggle'
                    onClick={toggleMic}>
                    <img
                      src={
                        micEnabled
                          ? '/external/micon.svg'
                          : '/external/micoff.svg'
                      }
                      alt='Mic toggle'
                      className='chatroom-mic-icon'
                    />
                  </div>
                </div>
                <div className='chatroom-leave-room'>
                  <Link
                    to='/main-screen-off'
                    className='chatroom-leave-room-link'>
                    <div className='chatroom-leave-room-button'>
                      <img
                        src='/external/closelight4264-tfpn.svg'
                        alt='Leave room icon'
                        className='chatroom-leave-room-icon'
                      />
                      <span className='chatroom-leave-room-text'>
                        Leave Room
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className='chatroom-chat'>
              <div
                className='chatroom-message-history'
                id='message-history'>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chatroom-message-wrap ${
                      message.isUser ? 'user-message' : 'received-message'
                    }`}>
                    <div className='chatroom-message'>
                      <span className='chatroom-message-text'>
                        {message.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='chatroom-new-message'>
                <input
                  type='text'
                  placeholder='Type a message'
                  className='chatroom-message-input'
                  id='message-input'
                  onKeyPress={handleKeyPress}
                />
                <img
                  src='/external/send4282-eyt7.svg'
                  alt='Send icon'
                  className='chatroom-send-icon'
                  onClick={sendMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
