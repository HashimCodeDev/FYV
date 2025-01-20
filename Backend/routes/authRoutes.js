const express = require('express');
const {
  register,
  login,
  logout,
  disconnect,
  verify,
  report,
  scanQRCode,
  getUser,
} = require('../controllers/authController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout ', logout);
router.post('/disconnect', disconnect);
router.post('/verify', verify);
router.post('/report', report);

router.get('/user/:userId', getUser);

router.post('/scan', upload.single('idCard'), scanQRCode);
module.exports = router;
