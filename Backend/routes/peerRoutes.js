const express = require('express');
const { getPeerId } = require('../controllers/peerController');

const router = express.Router();

router.get('/:id', getPeerId);

module.exports = router;
