const express = require('express');
const {
  getPeerId,
  joinRoom,
  matchMake,
  leaveRoom,
} = require('../controllers/peerController');

const router = express.Router();

router.post('/getpeerid', getPeerId);
router.post('/joinroom', joinRoom);
router.post('/matchmake', matchMake);
router.post('/leaveroom', leaveRoom);

module.exports = router;
