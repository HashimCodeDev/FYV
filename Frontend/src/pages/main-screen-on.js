import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Helmet } from 'react-helmet';

import '../styles/main-screen-on.css';

const MainScreenON = () => {
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
    <div className='main-screen-on-container'>
      <Helmet>
        <title>FYV</title>
      </Helmet>
      <div className='main-screen-on-main-screen-on'>
        {/* Sidebar */}
        <div className='main-screen-on-sidebar'>
          <div className='main-screen-on-header1'>
            <img
              src='/external/fyv_nobmg.png'
              alt='FYV logo'
              className='main-screen-on-vibeno-bmg1'
            />
            <span className='main-screen-on-text10'>FYV</span>
          </div>
        </div>

        {/* Main content */}
        <div className='main-screen-on-main'>
          {/* Header */}
          <div className='main-screen-on-header2'>
            <div className='main-screen-on-left'>
              <span className='main-screen-on-text11'>Chatroom</span>
              <div className='main-screen-on-duration'>
                <span className='main-screen-on-text12 Body1(Medium)'>
                  ({formatTime(time)})
                </span>
              </div>
            </div>
            <div className='main-screen-on-right'>
              <img
                src='/external/morevertical4246-xt6.svg'
                alt='More options'
                className='main-screen-on-morevertical'
              />
              <div className='main-screen-on-input-button'>
                <span className='main-screen-on-text13 Body1(Medium)'>
                  Next room (Spacebar)
                </span>
                <img
                  src='/external/arrowforwardi424-faqf.svg'
                  alt='Next room'
                  className='main-screen-on-arrowforward'
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='main-screen-on-content'>
            {/* Video Stream */}
            <div className='main-screen-on-video-stream'>
              <div className='main-screen-on-camera1'>
                <div className='main-screen-on-controls1'>
                  <span className='main-screen-on-text14 Body1(Medium)'>
                    Video disabled
                  </span>
                  <img
                    src='/external/eyeoff4254-1zar.svg'
                    alt='Video disabled icon'
                    className='main-screen-on-eyeoff'
                  />
                </div>
              </div>
              <div className='main-screen-on-camera2'>
                {videoEnabled && (
                  <Webcam
                    audio={micEnabled}
                    mirrored
                    className='main-screen-on-camera2'
                  />
                )}
              </div>
              <div className='main-screen-on-controls2'>
                <div className='main-screen-on-middle'>
                  <div
                    className='main-screen-on-control1'
                    onClick={toggleVideo}>
                    <img
                      src={
                        videoEnabled
                          ? '/external/video4259-zxik.svg'
                          : '/external/videooff.png'
                      }
                      alt='Video toggle'
                      className='main-screen-on-video'
                    />
                  </div>
                  <div
                    className='main-screen-on-control2'
                    onClick={toggleMic}>
                    <img
                      src={
                        micEnabled
                          ? '/external/micon.png'
                          : '/external/micoff4261-wg1j.svg'
                      }
                      alt='Mic toggle'
                      className='main-screen-on-mic'
                    />
                  </div>
                </div>
                <div className='main-screen-on-wrapper'>
                  <Link
                    to='/main-screen-off'
                    className='main-screen-on-navlink'>
                    <div className='main-screen-on-control3'>
                      <img
                        src='/external/closelight4264-tfpn.svg'
                        alt='Leave room icon'
                        className='main-screen-on-close-light'
                      />
                      <span className='main-screen-on-text15 Body1(Medium)'>
                        Leave Room
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className='main-screen-on-chat'>
              <div
                className='main-screen-on-message-history'
                id='message-history'>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`main-screen-on-message-wrap ${
                      message.isUser ? 'user-message' : 'received-message'
                    }`}>
                    <div className='main-screen-on-message'>
                      <span className='main-screen-on-text Body1'>
                        {message.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='main-screen-on-controls3'>
                <div className='main-screen-on-new-message-wrap'>
                  <input
                    type='text'
                    placeholder='Type a message'
                    className='main-screen-on-text20 Body1'
                    id='message-input'
                    onKeyPress={handleKeyPress}
                  />
                  <img
                    src='/external/send4282-eyt7.svg'
                    alt='Send icon'
                    className='main-screen-on-send'
                    onClick={sendMessage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreenON;
