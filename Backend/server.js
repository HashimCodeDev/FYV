const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const peerRoutes = require('./routes/peerRoutes');

const app = express();

// const options = {
//   key: fs.readFileSync('./cert.key'), // Server's private key
//   cert: fs.readFileSync('./cert.crt'), // Server's public certificate
//   ca: fs.readFileSync('./ca.cert'), // CA certificate for verifying the certificate chain
// };

const server = http.createServer(app);
const apiUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
// const apiUrl = 'https://192.168.137.1:3000';
console.log(apiUrl);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', apiUrl], // Allow requests from both localhost and your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', apiUrl], // Allow requests from both localhost and your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit for JSON payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Increase the limit for URL-encoded payloads

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  config.GOOGLE_APPLICATION_CREDENTIALS;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/peer', peerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);

    try {
      // Assuming you have a way to get the userId from the socket
      const userId = socket.userId;

      // Query to find connections involving the disconnected user
      const connectionQuery1 = db
        .collection('connection')
        .where('userId', '==', userId)
        .get();

      const connectionQuery2 = db
        .collection('connection')
        .where('peerId', '==', userId)
        .get();

      const connectionSnapshot = await Promise.all([connectionQuery1, connectionQuery2]);

      const connections = connectionSnapshot
        .flatMap((snapshot) => snapshot.docs)
        .map((doc) => ({ id: doc.id, ref: doc.ref, ...doc.data() }));

      if (connections.length > 0) {
        const connectionBatch = db.batch();
        connections.forEach((doc) => {
          console.log('Updating connection status to 3 for:', doc.id);
          connectionBatch.update(doc.ref, { status: 3 });
        });
        await connectionBatch.commit();
        console.log('Connection statuses updated successfully.');
      } else {
        console.log('No connections found for user:', userId);
      }
    } catch (error) {
      console.error('Error updating connection statuses on disconnect:', error);
    }
  });

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