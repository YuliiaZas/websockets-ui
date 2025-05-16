import type { WebSocket } from 'ws';

import { addPlayerToRoom } from '../database/rooms.js';
import { Message, MessageTypeEnum } from '../models/message.type.js';
import { Room } from '../models/room.type.js';
import { getDataFromMessage } from '../utils/getDataFromMessage.js';
import { isCreateRoomRequest } from '../utils/validation.js';

export function handleUserAddingToRoom(
  ws: WebSocket,
  message: Message,
  onSuccessCallback?: (room: Room) => void
) {
  if (message.type !== MessageTypeEnum.ADD_USER_TO_ROOM) return;

  try {
    const data = getDataFromMessage(message);
    if (!isCreateRoomRequest(data)) {
      throw new Error(
        'Invalid message data for room creation: ' + String(data)
      );
    }

    const room = addPlayerToRoom(data.indexRoom, ws.player);

    if (onSuccessCallback) {
      onSuccessCallback(room);
    }
  } catch (error) {
    console.error('Error handling user adding to room:', error);
    return;
  }
}
