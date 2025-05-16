import { createRoom } from '../database/rooms';
import { Message, MessageTypeEnum } from '../models/message.type';
import { Room } from '../models/room.type';

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
