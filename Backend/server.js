const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from your frontend's origin
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow requests from your frontend's origin
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
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = process.env.PORT || config.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
