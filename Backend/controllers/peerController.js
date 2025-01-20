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

    if (connectionSnapshot.empty) {
      console.error('No matching documents.');
      return res.status(200).json({ error: 'No users found for matching' });
    }
  } catch (error) {
    console.error('Error matching users:', error);
    return res.status(500).json({ error: 'Server error' });
  }

  const users = connectionSnapshot.docs.map((doc) => ({
    userId: doc.id,
    ...doc.data(),
  }));

  const randomUser = users[Math.floor(Math.random() * users.length)];
  console.log('Random User Id:', randomUser.userId);

  // Transaction to update user statuses
  try {
    await db.runTransaction(async (transaction) => {
      const userRef = db.collection('connection').doc(userId);
      const randomUserRef = db.collection('connection').doc(randomUser.userId);

      const userDoc = await transaction.get(userRef);
      const randomUserDoc = await transaction.get(randomUserRef);

      if (!userDoc.exists || !randomUserDoc.exists) {
        throw new Error('User not found');
      }

      // Update statuses to matched (1)
      transaction.update(userRef, { status: 1 });
      transaction.update(randomUserRef, { status: 1 });

      const now = new Date();
      const TEN_SECONDS = 10000; // 10 seconds in milliseconds
      const tenSecondsAgo = new Date(now.getTime() - TEN_SECONDS);

      const sessionSnapshot = await db
        .collection('session')
        .where('status', '==', 1)
        .where('createdAt', '>=', tenSecondsAgo)
        .get();

      const sessionExists = sessionSnapshot.docs.some((doc) => {
        const data = doc.data();
        return (
          (data.userId1 === userId && data.userId2 === randomUser.userId) ||
          (data.userId1 === randomUser.userId && data.userId2 === userId)
        );
      });

      if (!sessionExists) {
        // Create new session if none exist
        await db.collection('session').add({
          userId1: userId,
          peerId1: userDoc.peerId,
          userId2: randomUser.userId,
          peerId2: randomUser.peerId,
          createdAt: now,
          status: 1,
        });

        console.log('New session created');
      } else {
        console.log('Session already exists');
      }
    });

    console.log('Status updated for both users');
    return res.status(200).json({ message: 'Users matched', userId, remoteId: randomUser.peerId });
  } catch (error) {
    console.error('Error in transaction:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.leaveRoom = async (req, res) => {
  const { userId, peerId } = req.body;

  try {
    const connectionSnapshot = await db
      .collection('connection')
      .where('userId', '==', userId)
      .where('peerId', '==', peerId)
      .where('status', '==', 1)
      .get();

    // Check if any matching documents exist
    if (!connectionSnapshot.empty) {
      // Loop through each document and update its status
      const batch = db.batch(); // Use batch for atomic updates
      connectionSnapshot.forEach((doc) => {
        batch.update(doc.ref, { status: 3 });
      });

      await batch.commit(); // Commit all updates
      console.log('Connection status updated to 3.');
    } else {
      console.log('No matching connection found.');
    }

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

    // Run both queries in parallel
    const sessionSnapshot = await Promise.all([sessionQuery1, sessionQuery2]);

    // Combine and format the results
    const sessions = sessionSnapshot
      .flatMap((snapshot) => snapshot.docs) // Combine query results
      .map((doc) => ({ id: doc.id, ref: doc.ref, ...doc.data() })); // Extract ref for updates

    if (sessions.length > 0) {
      // Update each matching session's status to 2
      const updatePromises = sessions.map((session) =>
        session.ref.update({
          status: 2,
        })
      );

      // Wait for all updates to complete
      await Promise.all(updatePromises);
    }

    res.status(200).json({ message: 'User left successfully' });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
