const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/myapp' });

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.id);
});

console.log('PeerServer running on http://localhost:9000/myapp');

