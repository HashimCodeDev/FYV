import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'peerjs';
import axios from 'axios';

import '../styles/chatroom.css';

const Chatroom = () => {
  const [time, setTime] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [cancelRetry, setCancelRetry] = useState(false);
  const [loading, setLoading] = useState(true);

  const [peerId, setPeerId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerInstance = useRef();

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const server = process.env.REACT_APP_API_URL;
  // const server = 'https://192.168.1.3:5000';

  // Timer for chat duration
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // // Handle incoming chat messages
  // useEffect(() => {
  //   socket.on('chatMessage', (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   return () => {
  //     socket.off('chatMessage');
  //   };
  // }, [socket]);

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

  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      if (localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
          track.enabled = !prev;
        });
      }
      return !prev;
    });
  };

  const toggleMic = () => {
    setMicEnabled((prev) => {
      if (localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
          track.enabled = !prev;
        });
      }
      return !prev;
    });
  };

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

  //Stun and Turn Servers
  const iceConfiguration = {
    iceServers: [
      // Google's Public STUN Server
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
      {
        urls: 'stun:stun2.l.google.com:19302',
      },
      {
        urls: 'stun:stun3.l.google.com:19302',
      },
      {
        urls: 'stun:stun4.l.google.com:19302',
      },

      // Mozilla's Public STUN Server
      {
        urls: 'stun:stun.services.mozilla.com',
      },

      // OpenRelay TURN Server
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },

      // Twilio's Public STUN Server (optional, for testing)
      {
        urls: 'stun:global.stun.twilio.com:3478?transport=udp',
      },

      // Additional STUN Servers (Community-hosted)
      {
        urls: 'stun:stun.stunprotocol.org:3478',
      },
      {
        urls: 'stun:stun.sipnet.net',
      },
      {
        urls: 'stun:stun.ideasip.com',
      },
    ],
  };

  const leaveRoom = async () => {
    try {
      const response = await axios.post(
        `${server}/api/peer/leaveroom`,
        { userId, peerId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setCancelRetry(true);
      navigate('/lobby');
    } catch (e) {
      console.error('Error leaving room:', e);
    }
  };

  const startNextCall = async () => {
    if (!remoteId) {
      return;
    }
  };

  useEffect(() => {
    const socket = io(server, {
      withCredentials: true,
    });
    const peer = new Peer(undefined, {
      host: '0.peerjs.com',
      port: 443,
      path: '/',
      iceServers: [
        // Free STUN servers
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun.services.mozilla.com' },
        { urls: 'stun:openrelay.metered.ca:80' },

        // Free TURN servers
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
    });

    peer.on(
      'open',
      async (id) => {
        console.log('Connected to PeerJS server with ID:', id);
        setPeerId(id);

        try {
          const joinRoom = await axios.post(
            `${server}/api/peer/joinRoom`,
            { userId, peerId: id },
            { headers: { 'Content-Type': 'application/json' } }
          );
          startCall();
        } catch (error) {
          console.error('Error joining room:', error);
        }
      },
      [peerId]
    );

    peer.on('call', async (call) => {
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
      socket.close();
      peer.disconnect();
    };
  }, []);

  const startCall = async () => {
    try {
      let remoteId = null;

      // Loop until a matching user is found
      while (!remoteId) {
        if (cancelRetry) {
          return;
        }
        // Make a request to the server to find a matching user
        const response = await axios.post(
          `${server}/api/peer/matchmake`,
          { userId },
          { headers: { 'Content-Type': 'application/json' } }
        );

        remoteId = response.data.remoteId; // Get remoteId from the response

        // If no match, wait for a few seconds before trying again
        if (!remoteId && !cancelRetry) {
          console.log('No match found. Retrying...');
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
        }
      }

      setLoading(false);
      setRemoteId(remoteId); // Set the remoteId once a match is found
      console.log('Found match with remoteId:', remoteId);

      // After a match is found, start the media stream and initiate the call
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          localVideoRef.current.srcObject = mediaStream;

          // Initiate the call with the found remoteId
          const call = peerInstance.current.call(remoteId, mediaStream);

          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream; // Show remote video
          });
        })
        .catch((err) => {
          console.error('Error accessing media devices:', err);
        });
    } catch (err) {
      console.error('Error starting call:', err);
    }
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
        <button
          onClick={leaveRoom}
          className='leave-btn'>
          <img
            className='exit'
            src='/external/exit.svg'
            alt='exit button'
          />
        </button>
      </div>
    );
  };

  return (
    <div className='chatroom-container'>
      {loading && (
        <img
          className='loading-spinner'
          src='/external/loading.svg'
          alt='Loading...'
        />
      )}
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
        <div className='next-btn'>
          <button onClick={startNextCall}>Next Call</button>
          <img
            className='next'
            src='/external/next.svg'
            alt='next button'
          />
        </div>
      </div>
      <div className='chatroom-local-screen'>
        <video
          className='local-video'
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
