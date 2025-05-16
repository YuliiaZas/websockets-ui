import { createRoom } from '../database/rooms.js';
import { Message, MessageTypeEnum } from '../models/message.type.js';
import { Room } from '../models/room.type.js';

export function handleRoomCreation(
  message: Message,
  onSuccessCallback?: (room: Room) => void
) {
  if (message.type !== MessageTypeEnum.CREATE_ROOM) return;

  const room = createRoom();

  if (onSuccessCallback) {
    onSuccessCallback(room);
  }
}
