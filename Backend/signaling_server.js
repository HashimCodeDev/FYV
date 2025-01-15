const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {};

wss.on('connection', ws => {
  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      const { type, room, payload } = data;

      switch (type) {
        case 'join':
          if (!rooms[room]) {
            rooms[room] = new Set();
          }
          rooms[room].add(ws);
          break;
        case 'signal':
          if (rooms[room]) {
            rooms[room].forEach(client => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payload));
              }
            });
          }
          break;
        default:
          console.error('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', () => {
    for (const room in rooms) {
      rooms[room].delete(ws);
      if (rooms[room].size === 0) {
        delete rooms[room];
      }
    }
    console.log('Client disconnected');
  });
});

console.log('WebSocket signaling server running on ws://localhost:8080');
