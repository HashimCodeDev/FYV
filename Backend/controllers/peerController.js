exports.getPeerId = (req, res) => {
  console.log("hi")
  const peerId = req.params.id;
  res.json({ peerId });
};
