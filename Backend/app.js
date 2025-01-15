const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PeerServer } = require('peer');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');



require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);



module.exports = app;
