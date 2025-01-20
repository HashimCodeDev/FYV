const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../firebase');
const config = require('../config');

exports.register = async (req, res) => {
  const {name, email, password,interests } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    const userRef = db.collection('users').doc();
    await userRef.set({name, email, password: hashedPassword });
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    let userid;
    userSnapshot.forEach(doc => {
      userid = doc.id;
    });
    const interestRef = db.collection('interests').doc();
    await interestRef.set({userid,interest:interests});

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
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

    res.json({ message: 'Login Succesful ', JwtToken: token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.scanId = async (req, res) => {
  const { idData } = req.body;

  try {
    const userRef = db.collection('users').doc();
    await userRef.set({ idData });

    res.status(201).json({ message: 'ID data saved successfully' });
  } catch (error) {
    console.error('Error saving ID data:', error);
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

exports.report = async (req, res) => {
  const {userid } = req.body;

  try {
    const userRef = db.collection('users').doc(userid);
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
      transaction.set(reportRef, { userId, reportDetails, timestamp: new Date() });
    });
    res.status(201).json({ message: 'User reported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};