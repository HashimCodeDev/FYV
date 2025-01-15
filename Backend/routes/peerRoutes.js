const express = require('express');
const {
  getPeerId,
  addPeerData,
  addUserToMatching,
  fetchAndConnectUsers,
  establishVideoChat,
  disconnectVideoChat
} = require('./controllers/peerController'); // Adjust the path as necessary

const router = express.Router();

router.get('/peer/:id', getPeerId);
router.post('/add-peer', addPeerData);
router.post('/add-to-matching', addUserToMatching);
router.post('/connect-users', fetchAndConnectUsers);
router.post('/establish-video-chat', establishVideoChat);
router.post('/disconnect-video-chat', disconnectVideoChat);

module.exports = router;
