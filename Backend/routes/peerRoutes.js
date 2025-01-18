const express = require('express');
const {
  getPeerId,
  joinRoom,
  matchMake,
} = require('../controllers/peerController');

const router = express.Router();

router.post('/getpeerid', getPeerId);
router.post('/joinroom', joinRoom);
router.post('/matchmake', matchMake);

module.exports = router;
