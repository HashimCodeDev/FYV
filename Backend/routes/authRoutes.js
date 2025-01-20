const express = require('express');
const {
  register,
  login,
  scanId,
  logout,
  disconnect,
  verify,
  report,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/scanid', scanId);
router.post('/logout ', logout);
router.post('/disconnect', disconnect);
router.post('/verify', verify);
router.post('/report', report);

module.exports = router;
