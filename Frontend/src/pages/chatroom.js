import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

import '../styles/chatroom.css';

const Chatroom = () => {
  const [time, setTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const [peerId, setPeerId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerInstance = useRef();

  const server = 'https://fyv-production.up.railway.app/';

  const socket = io(server, {
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

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: '0.peerjs.com',
      port: 443,
      path: '/',
    });

    peer.on('open', (id) => {
      console.log('Connected to PeerJS server with ID:', id);
      setPeerId(id);
    });

    peer.on('call', (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true }) // Get local media (video + audio)
        .then((mediaStream) => {
          call.answer(mediaStream); // Answer the call with the local media stream
          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream; // Display remote video
          });
        });
    });

    peerInstance.current = peer;

    return () => {
      peer.disconnect();
    };
  }, []);

  const startCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        localVideoRef.current.srcObject = mediaStream;

        const call = peerInstance.current.call(remoteId, mediaStream);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream; // Show remote video
        });
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });
  };

  useEffect(() => {
    if (micEnabled && videoEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          localVideoRef.current.srcObject = mediaStream;
        });
    } else if (!micEnabled && !videoEnabled) {
      localVideoRef.current.srcObject = null;
    } else if (!micEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          localVideoRef.current.srcObject = mediaStream;
        });
    } else if (!videoEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((mediaStream) => {
          localVideoRef.current.srcObject = mediaStream;
        });
    }
  }, [micEnabled, videoEnabled]);

  const Controls = () => {
    return (
      <div className='chatroom-controls'>
        <button
          onClick={toggleVideo}
          className='video-toggle-btn'
          aria-label={videoEnabled ? 'Turn off video' : 'Turn on video'}
          title={videoEnabled ? 'Turn off video' : 'Turn on video'}>
          <img
            className='video'
            src={
              videoEnabled ? '/external/videoon.svg' : '/external/videooff.svg'
            }
            alt={videoEnabled ? 'Video on' : 'Video off'}
          />
        </button>
        <button
          onClick={toggleMic}
          className='mic-toggle-btn'>
          <img
            className='mic'
            src={micEnabled ? '/external/micon.svg' : '/external/micoff.svg'}
            alt={micEnabled ? 'Microphone on' : 'Microphone off'}
          />
        </button>
      </div>
    );
  };

  return (
    <div className='chatroom-container'>
      <div className='chatroom-header'>
        <p>Your Peer ID: {peerId}</p>
        <input
          type='text'
          placeholder='Enter remote peer ID'
          value={remoteId}
          onChange={(e) => setRemoteId(e.target.value)}
        />
        <button onClick={startCall}>Start Call</button>
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
      <div className='chatroom-local-screen'>
        <video
          ref={localVideoRef}
          autoPlay
          muted></video>
      </div>
      <div className='chatroom-remote-screen'>
        <video
          ref={remoteVideoRef}
          autoPlay></video>
      </div>
      <Controls />
    </div>
  );
};

export default Chatroom;
