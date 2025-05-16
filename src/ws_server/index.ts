import { WebSocketServer } from 'ws';

import { Message } from '../models/message.type';
import { handleMessage } from './handleMessage';

const WS_PORT = 3000;
export const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let message: Message;
    try {
      message = JSON.parse(data.toString());
    } catch (err) {
      return console.error('Invalid JSON:', err);
    }

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

wss.on('error', (error) => {
  console.error('WebSocket error:', error);
});

console.log(`WebSocket server started on ws://localhost:${WS_PORT}`);
