import { WebSocket } from 'ws';

import { Message, MessageTypeEnum } from '../models/message.type.js';
import { Player } from '../models/player.type.js';
import { wss } from '../ws_server/index.js';

export function sendMessage<T>(
  type: MessageTypeEnum,
  data: Message<T>['data'],
  ws: WebSocket | null,
  targetPlayerIds?: string[]
): void {
  const payload = createMessagePayload(type, data);
  sendMessageWithPayload(payload, ws, targetPlayerIds);
}

export function sendMessageWithPayload(
  payload: Message<string> | null,
  ws: WebSocket | null,
  targetPlayerIds?: string[]
) {
  if (!payload) {
    console.error(`Failed to send message: payload is empty`);
    return;
  }

  let payloadString: string;
  try {
    payloadString = JSON.stringify(payload);
  } catch (err) {
    console.error(
      `Failed to send message for command '${payload.type}' with data:`,
      payload.data,
      '\nError:',
      err
    );
    return;
  }

  if (ws) {
    ws.send(payloadString);
  } else {
    for (const client of wss.clients) {
      if (
        client.readyState === WebSocket.OPEN &&
        'player' in client &&
        client.player &&
        (!targetPlayerIds ||
          targetPlayerIds.includes((client.player as Player).index))
      ) {
        client.send(payloadString);
      }
    }
  }

  console.log(
    `Command '${payload.type}' sent successfully to client${ws ? '' : 's'} with data:`,
    payload.data
  );
}

export function createMessagePayload<T>(
  type: MessageTypeEnum,
  data: Message<T>['data']
): Message<string> | null {
  try {
    return {
      type,
      data: JSON.stringify(data),
      id: 0,
    };
  } catch (err) {
    console.error(
      `Failed stringify data for command '${type}' with data:`,
      data,
      '\nError:',
      err
    );
    return null;
  }
}
