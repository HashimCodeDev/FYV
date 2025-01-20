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

exports.getUser = async (req, res) => {
  try {
    const userSnapshot = await db
      .collection('users')
      .doc(req.params.userId)
      .get();
    if (!userSnapshot.exists) {
      console.error('No matching documents.');
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userSnapshot.data();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.register = async (req, res) => {
  const { name, email, password, interests } = req.body;

  try {
    const existingUser = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    if (!existingUser.empty) {
      // Check if the QuerySnapshot is not empty
      return res.status(400).json({ error: 'User already exists' });
    }
    // Store additional user data in Firestore
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    const userRef = db.collection('users').doc();
    await userRef.set({
      name,
      email,
      password: hashedPassword,
      status: 0,
      emailVerified: false, // Track verification status
      createdAt: new Date(),
    });

    const interestRef = db.collection('interests').doc();
    await interestRef.set({ userId: userRef.id, interest: interests });

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

    if (!user.emailVerified) {
      return res.status(400).json({ error: 'Email Not Verified!' });
    }
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

exports.verify = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email in Firestore
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRef = userSnapshot.docs[0].ref; // Get the document reference
    await userRef.update({ emailVerified: true, status: 1 }); // Update emailVerified field

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error updating emailVerified status:', error);
    res.status(500).json({ error: 'Server error' });
  }
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

exports.report = async (req, res) => {
  const { userId } = req.body;

  try {
    const userRef = db.collection('users').doc(userId);
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User does not exist');
      }

      const userData = userDoc.data();
      const newReportCount = (userData.reports || 0) + 1;
      const updates = { reports: newReportCount };

      if (newReportCount > 4) {
        updates.status = 2;
        updates.banUntil = new Date(Date.now() + 15 * 60 * 1000); // Ban for 15 minutes
      }

      transaction.update(userRef, updates);

      const reportRef = db.collection('reports').doc();
      transaction.set(reportRef, {
        userId,
        count: newReportCount,
        timestamp: new Date(),
      });
    });
    res.status(201).json({ message: 'User reported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
