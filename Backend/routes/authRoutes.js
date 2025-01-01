const express = require('express');
const { register, login, scanId } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/scanid', scanId);

module.exports = router;
