import { WebSocket } from 'ws';

import { wss } from '../ws_server';
import { Message } from '../entities/message.type';

export function sendMessage<T>(
  type: string,
  data: Message<T>['data'],
  ws: WebSocket | null
): void {
  try {
    const payload = JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    });

    if (ws) {
      ws.send(payload);
    } else {
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    }

    console.log(`Command '${type}' sent successfully with data:`, data);
  } catch (err) {
    console.error(
      `Failed to send message for command '${type}' with data`,
      data,
      '\nError:',
      err
    );
  }
}
