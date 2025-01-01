const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../firebase');
const config = require('../config');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection('users').doc();
    await userRef.set({ email, password: hashedPassword });

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
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = userSnapshot.docs[0].data();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: userSnapshot.docs[0].id },
      config.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};