const express = require('express');
const { PeerServer } = require('peer');
const {
  getPeerId,
  addPeerData,
  addUserToMatching,
  fetchAndConnectUsers,
  getUserId
} = require('../controllers/peerController'); // Adjust the path as necessary

const router = express.Router();

// Initialize PeerJS server
const peerServer = PeerServer({ port: 9000, path: '/peerjs' });

router.use(peerServer);

router.get('/peer/:id', getPeerId);
router.post('/add-peer', addPeerData);
router.post('/add-to-matching', addUserToMatching);
router.post('/connect-users', fetchAndConnectUsers);

// New route to get user ID from frontend
router.post('/get-user-id', getUserId);

module.exports = router;
