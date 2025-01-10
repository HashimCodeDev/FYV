const express = require('express');
const {
  register,
  login,
  scanId,
  logout,
  disconnect,
  verify,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/scanid', scanId);
router.post('/logout ', logout);
router.post('/disconnect', disconnect);
router.post('/verify', verify);

module.exports = router;
