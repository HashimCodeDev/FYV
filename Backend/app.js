const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const { PeerServer } = require('peer'); // Remove this line

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const peerRoutes = require('./routes/peerRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/peer', peerRoutes);

module.exports = app;
