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
  console.log('User trying to match:', userId);
  let connectionSnapshot;

  try {
    console.log('Finding Match');
    connectionSnapshot = await db
      .collection('connection')
      .where('status', '==', 2)
      .where('userId', '!=', userId)
      .get();
    console.log('Users Found', connectionSnapshot.docs[0].data());
  } catch (error) {
    console.error('Error matching users:', error);
    res.status(500).json({ error: 'Server error' });
  }

  if (connectionSnapshot && connectionSnapshot.empty) {
    console.error('No matching documents.');
    return res.status(200).json({ error: 'No users found for matching' });
  }
  const users = connectionSnapshot.docs.map((doc) => ({
    userid: doc.userId,
    ...doc.data(),
  }));
  const randomUser = users[Math.floor(Math.random() * users.length)];

  // Update user statuses to matched (1) in both sessions and matching collections
  const batch = db.batch();

  // Find the document with the userId in the 'connection' collection
  const userDocRef = db.collection('connection').where('userId', '==', userId);
  const randomUserDocRef = db
    .collection('connection')
    .where('userId', '==', randomUser.userid);

  try {
    // Get the snapshot of the documents for both userId and randomUser.userid
    const userSnapshot = await userDocRef.get();
    const randomUserSnapshot = await randomUserDocRef.get();

    if (!userSnapshot.empty && !randomUserSnapshot.empty) {
      // Update the status of the matched user documents
      userSnapshot.forEach((doc) => {
        batch.update(doc.ref, { status: 1 });
      });

      randomUserSnapshot.forEach((doc) => {
        batch.update(doc.ref, { status: 1 });
      });

      // Commit the batch update
      await batch.commit();
      console.log('Status updated for both users');
    } else {
      console.error(
        'No matching documents found for userId or randomUser.userid'
      );
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
  res
    .status(200)
    .json({ message: 'Users matched', userId, remoteId: randomUser.peerId });
};
