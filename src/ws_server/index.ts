import { WebSocketServer } from 'ws';

const WS_PORT = 8080;
const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});

console.log(`WebSocket server started on ws://localhost:${WS_PORT}`);
