const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
console.log(apiUrl);
const io = socketIo(server, {
  cors: {
    origin: apiUrl, // Allow requests from your frontend's origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: apiUrl,
    credentials: true,
  })
); // Allow requests from your frontend's origin
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit for JSON payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase the limit for URL-encoded payloads

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  config.GOOGLE_APPLICATION_CREDENTIALS;

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});

  // Handle incoming chat messages
  socket.on('chatMessage', (message) => {
    console.log('Received message:', message);
    io.emit('chatMessage', message); // Broadcast message to all connected clients
  });
});

const port = process.env.PORT || config.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
