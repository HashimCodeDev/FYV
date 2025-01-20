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
        status: 2,
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
    console.log('Users Found', connectionSnapshot.docs[0]);
  } catch (error) {
    console.error('Error matching users:', error);
    res.status(500).json({ error: 'Server error' });
  }

  if (connectionSnapshot && connectionSnapshot.empty) {
    console.error('No matching documents.');
    return res.status(200).json({ error: 'No users found for matching' });
  }
  const users = connectionSnapshot.docs.map((doc) => ({
    userId: doc.userId,
    ...doc.data(),
  }));
  const randomUser = users[Math.floor(Math.random() * users.length)];
  console.log('Random User Id:', randomUser.userId);

  // Update user statuses to matched (1) in both sessions and matching collections
  const batch = db.batch();

  // Find the document with the userId in the 'connection' collection
  const userDocRef = db.collection('connection').where('userId', '==', userId);
  const randomUserDocRef = db
    .collection('connection')
    .where('userId', '==', randomUser.userId);

  try {
    // Get the snapshot of the documents for both userId and randomUser.userid
    const userSnapshot = await userDocRef.get();
    const randomUserSnapshot = await randomUserDocRef.get();

    const TEN_SECONDS = 10000; // 10 seconds in milliseconds
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - TEN_SECONDS);

    const sessionSnapshot = await db
      .collection('session')
      .where('status', '==', 1) // Match active sessions
      .where('createdAt', '>=', tenSecondsAgo) // Check if created within the last 10 seconds
      .get();

    let sessionExists = false;

    // Loop through the results to check if a session between the same users exists
    sessionSnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        (data.userId1 === userId && data.userId2 === randomUser.userId) ||
        (data.userId1 === randomUser.userId && data.userId2 === userId)
      ) {
        sessionExists = true; // Found a matching session
      }
    });

    if (!sessionExists) {
      // Add a new session since no matching session exists
      await db.collection('session').add({
        userId1: userId,
        userId2: randomUser.userId,
        createdAt: now,
        status: 1,
      });
      console.log('New session created');
    }

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

exports.leaveRoom = async (req, res) => {
  const { userId, peerId } = req.body;

  try {
    // Query sessions where the user is either userId1 or userId2
    const sessionQuery1 = db
      .collection('session')
      .where('userId1', '==', userId)
      .where('peerId1', '==', peerId)
      .where('status', '==', 1)
      .get();

    const sessionQuery2 = db
      .collection('session')
      .where('userId2', '==', userId)
      .where('peerId2', '==', peerId)
      .where('status', '==', 1)
      .get();

    // Run both queries concurrently
    const sessionSnapshot = await Promise.all([sessionQuery1, sessionQuery2]);

    // Combine and format results
    const sessions = sessionSnapshot
      .flatMap((snapshot) => snapshot.docs)
      .map((doc) => ({ id: doc.id, ref: doc.ref, ...doc.data() }));

    if (sessions.length > 0) {
      // Update each matching session's status to 3
      const updatePromises = sessions.map((session) =>
        session.ref.update({ status: 3 })
      );
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      console.log('Session status updated to 3.');
    } else {
      console.log('No matching session found.');
    }

    // Check and update the connection status for both users
    const connectionQuery1 = db
      .collection('connection')
      .where('userId', '==', userId)
      .where('peerId', '==', peerId)
      .where('status', '==', 1)
      .get();

    const connectionQuery2 = db
      .collection('connection')
      .where('userId', '==', peerId)
      .where('peerId', '==', userId)
      .where('status', '==', 1)
      .get();

    // Run both queries concurrently
    const connectionSnapshot = await Promise.all([connectionQuery1, connectionQuery2]);

    // Combine and format results
    const connections = connectionSnapshot
      .flatMap((snapshot) => snapshot.docs)
      .map((doc) => ({ id: doc.id, ref: doc.ref, ...doc.data() }));

    if (connections.length > 0) {
      const batch = db.batch();
      connections.forEach((doc) => {
        batch.update(doc.ref, { status: 3 });
      });
      await batch.commit();
      console.log('Connection statuses updated to 3.');
    } else {
      console.log('No matching connection found.');
    }

    res.status(200).json({ message: 'User left successfully' });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
