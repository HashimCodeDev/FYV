const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { admin, db } = require('../firebase');
const config = require('../config');
const qrCodeReader = require('qrcode-reader');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const { getAuth } = require('firebase-admin/auth');
const apiUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

exports.register = async (req, res) => {
  const { name, email, password, interests } = req.body;

  try {
    const auth = getAuth();

    // Create the user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    console.log('Firebase User ID:', userRecord.uid);

    // Send email verification link
    const actionCodeSettings = {
      url: `${apiUrl}/login`,
      handleCodeInApp: true,
    };

    await auth
      .generateEmailVerificationLink(email, actionCodeSettings)
      .then((link) => {
        console.log('Verification link:', link);
        // Here you can use a mail service like Nodemailer to send the verification link
        // sendEmailWithVerificationLink(email, link); // Custom function to send the email
      });

    // Store additional user data in Firestore
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set({
      name,
      email,
      interests,
      emailVerified: false, // Track verification status
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const interestRef = db.collection('interests').doc();
    await interestRef.set({ userId: userRecord.uid, interest: interests });

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === 'auth/email-already-exists') {
      return res
        .status(400)
        .json({ error: 'User already exists with this email' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    if (userSnapshot.empty) {
      console.log('No matching documents.');
      return res
        .status(400)
        .json({ error: 'Invalid credentials: email not found' });
    }

    const user = userSnapshot.docs[0].data();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: 'Invalid credentials: incorrect password' });
    }

    const payload = {
      userId: userSnapshot.docs[0].id,
      userName: user.email,
      role: 'user',
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      userId: userSnapshot.docs[0].id,
      JwtToken: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.disconnect = (req, res) => {
  res.json({ message: 'Disconnect successful' });
};

exports.verify = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('Decoded:', decoded);
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ message: 'Verification successful' });
};

exports.scanQRCode = async (req, res) => {
  const filePath = path.join(__dirname, '..', req.file.path);

  try {
    const buffer = fs.readFileSync(filePath);
    const image = await Jimp.read(buffer);
    const qr = new qrCodeReader();

    qr.callback = (err, value) => {
      if (err) {
        res.status(500).send('Error reading QR code');
        return;
      }

      // Assuming the QR code contains JSON data
      const details = JSON.parse(value.result);

      // Print details to console
      console.log('Extracted Details:', details);

      res.json(details);
    };

    qr.decode(image.bitmap);
  } catch (error) {
    res.status(500).send('Error processing image');
  } finally {
    fs.unlinkSync(filePath); // Clean up uploaded file
  }
};
