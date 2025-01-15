const { db } = require('../firebase');

// Function to generate a unique 6-digit peerId
function generatePeerId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get Peer ID
exports.getPeerId = (req, res) => {
  const peerId = req.params.id;
  res.json({ peerId });
};

// Add Peer Data to Firestore
exports.addPeerData = async (req, res) => {
  const { peerId, user_id_1, user_id_2, status } = req.body;

  try {
    const peerRef = db.collection('peers').doc(peerId);

    const doc = await peerRef.get();
    if (doc.exists) {
      res.status(400).send('Error: Document with this peerId already exists.');
      return;
    }

    await peerRef.set({
      user_id_1,
      user_id_2,
      status,
    });

    res.status(201).send('Document successfully written!');
  } catch (error) {
    console.error('Error writing document: ', error);
    res.status(500).send('Error writing document');
  }
};

// Add User to Matching Collection
exports.addUserToMatching = async (req, res) => {
  const { userid, status } = req.body;

  try {
    await db.collection('matching').doc(userid).set({ status });
    res.status(201).send('User status added to matching collection');
  } catch (error) {
    console.error('Error adding user to matching collection:', error);
    res.status(500).send('Error adding user to matching collection');
  }
};

// Fetch and Connect Users
exports.fetchAndConnectUsers = async (req, res) => {
  try {
    const userStatusRef = db.collection('matching');
    const querySnapshot = await userStatusRef.where('status', '==', 2).get();

    if (querySnapshot.empty) {
      res.status(404).send('No users with status 2 found');
      return;
    }

    const users = querySnapshot.docs.map(doc => ({ userid: doc.id, ...doc.data() }));

    if (users.length < 2) {
      res.status(200).send('Not enough users to connect');
      return;
    }

    const [user1, user2] = users;
    const peerId = generatePeerId();

    const peerConnectionsRef = db.collection('peer_connections').doc(peerId);
    await peerConnectionsRef.set({
      peerId,
      users: [
        { userid: user1.userid, status: 1 }, // Connected
        { userid: user2.userid, status: 1 }  // Connected
      ],
      createdAt: new Date().toISOString()
    });

    await userStatusRef.doc(user1.userid).update({ status: 1, peerId });
    await userStatusRef.doc(user2.userid).update({ status: 1, peerId });

    // Add session entry
    const sessionRef = db.collection('sessions').doc(peerId);
    await sessionRef.set({
      peerId,
      users: [
        { userid: user1.userid },
        { userid: user2.userid }
      ],
      createdAt: new Date().toISOString()
    });

    res.status(200).send({ peerId, users: [user1.userid, user2.userid] });
  } catch (error) {
    console.error('Error fetching and connecting users:', error);
    res.status(500).send('Error fetching and connecting users');
  }
};

// Establish Video Chat Connection
exports.establishVideoChat = async (req, res) => {
  const { peerId } = req.body;

  try {
    const sessionRef = db.collection('sessions').doc(peerId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const users = sessionData.users;

    // Here, you would handle the WebRTC signaling process using WebSockets
    // For simplicity, we'll simulate the signaling process
    users.forEach(user => {
      // Simulate sending WebRTC signaling data to each user
      console.log(`Sending WebRTC signaling data to user: ${user.userid}`);
    });

    res.status(200).json({ message: 'Video chat connection established', users, peerId });
  } catch (error) {
    console.error('Error establishing video chat connection:', error);
    res.status(500).json({ error: 'Error establishing video chat connection' });
  }
};

// Disconnect Users from Video Chat
exports.disconnectVideoChat = async (req, res) => {
  const { peerId } = req.body;

  try {
    const sessionRef = db.collection('sessions').doc(peerId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = sessionDoc.data();
    const users = sessionData.users;

    // Update user statuses to disconnected (3) in both sessions and matching collections
    const batch = db.batch();
    users.forEach(user => {
      const userStatusRef = db.collection('matching').doc(user.userid);
      batch.update(userStatusRef, { status: 3 });
    });

    // Commit batch update
    await batch.commit();

    res.status(200).json({ message: 'Users disconnected from video chat', peerId });
  } catch (error) {
    console.error('Error disconnecting users from video chat:', error);
    res.status(500).json({ error: 'Error disconnecting users from video chat' });
  }
};

exports.getUserId = (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  res.json({ message: 'User ID received', userId });
};


