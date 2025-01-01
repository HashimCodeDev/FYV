const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PeerServer } = require('peer');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const peerRoutes = require('./routes/peerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/peer', peerRoutes);

// PeerJS server
const peerServer = PeerServer({ port: 9000, path: '/peerjs' });

module.exports = app;
