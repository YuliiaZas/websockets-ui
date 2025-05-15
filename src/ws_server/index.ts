import { WebSocketServer } from 'ws';

import { Message } from '../entities/message.type';
import { handleMessage } from './handleMessage';

const WS_PORT = 3000;
export const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (data, isBinary) => {
    console.log('Received data:', data, isBinary);
    let message: Message;
    try {
      message = JSON.parse(data.toString());
    } catch (err) {
      return console.error('Invalid JSON:', err);
    }
    console.log('Received command:', message.type);

    try {
      handleMessage(ws, message);
    } catch (error) {
      console.error('Error handling message:', message, error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});

console.log(`WebSocket server started on ws://localhost:${WS_PORT}`);
