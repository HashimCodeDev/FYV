const { db } = require('../firebase');
const bcrypt = require('bcryptjs');
const config = require('../config');

exports.getPeerId = async (req, res) => {
  const { peerId } = req.body;

  try {
    const peerRef = db.collection('connection').doc(peerId);
    const peerDoc = await peerRef.get();
    if (!peerDoc.exists) {
      console.error('No matching documents.');
      return res.status(400).json({ error: 'Invalid peerId' });
    }
    const peerData = peerDoc.data();
    const users = peerData.users;
    res.status(200).json({ users, peerId });
  } catch (e) {
    console.error('Error getting peer ID:', e);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.joinRoom = async (req, res) => {
  const { userId, peerId } = req.body;

  try {
    const connectionSnapshot = await db
      .collection('connection')
      .where('userId', '==', userId)
      .get();

    console.log(connectionSnapshot.docs[0]);
    if (connectionSnapshot.empty) {
      const connectionRef = db.collection('connection').doc();
      await connectionRef.set({
        userId: userId,
        peerId: peerId,
        status: 2,
        joinedAt: new Date(),
      });
    } else {
      // If a document with the userId exists, update the joinedAt field
      const connectionDoc = connectionSnapshot.docs[0];
      await connectionDoc.ref.update({
        peerId: peerId,
        joinedAt: new Date(),
      });
    }
    res.status(201).json({ message: 'User joined successfully' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.matchMake = async (req, res) => {
  const { userId } = req.body;

  try {
    const connectionSnapshot = await db
      .collection('connection')
      .where('status', '==', 2)
      .get();
    console.log(connectionSnapshot.docs[0]);

    if (connectionSnapshot.empty) {
      console.error('No matching documents.');
      return res.status(404).json({ error: 'No users found for matching' });
    }
    const users = connectionSnapshot.docs.map((doc) => ({
      userid: doc.id,
      ...doc.data(),
    }));
    const randomUser = users[Math.floor(Math.random() * users.length)];

    // Update user statuses to matched (1) in both sessions and matching collections
    // const batch = db.batch();
    // batch.update(db.collection('connection').doc(userId), { status: 1 });
    // batch.update(db.collection('connection').doc(randomUser.userid), {
    //   status: 1,
    // });
    // await batch.commit();

    res
      .status(200)
      .json({ message: 'Users matched', userId, remoteId: randomUser.userid });
  } catch (error) {
    console.error('Error matching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
