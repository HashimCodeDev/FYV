exports.getPeerId = (req, res) => {
  const peerId = req.params.id;
  res.json({ peerId });
};
