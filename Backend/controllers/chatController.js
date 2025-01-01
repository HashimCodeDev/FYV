const { db } = require('../firebase');

exports.getMessages = async (req, res) => {
  try {
    const messagesSnapshot = await db
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  const { text, userId } = req.body;

  try {
    const messageRef = db.collection('messages').doc();
    await messageRef.set({ text, userId, createdAt: new Date() });

    res
      .status(201)
      .json({ id: messageRef.id, text, userId, createdAt: new Date() });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
