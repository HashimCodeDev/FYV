const express = require('express');
const {
  register,
  login,
  logout,
  disconnect,
  verify,
scanQRCode,
} = require('../controllers/authController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout ', logout);
router.post('/disconnect', disconnect);
router.post('/verify', verify);
router.post('/scan', upload.single('idCard'), scanQRCode);
module.exports = router;
