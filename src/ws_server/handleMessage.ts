import type { WebSocket } from 'ws';

import { handleGameCreation } from '../commands/handleGameCreation';
import { handleRegistration } from '../commands/handleRegistration';
import { handleRoomCreation } from '../commands/handleRoomCreation';
import { handleUserAddingToRoom } from '../commands/handleUserAddingToRoom';
import { getRooms, isRoomFull } from '../database/rooms';
import { getWinners } from '../database/winners';
import { Message, MessageTypeEnum } from '../models/message.type';
import { AddUserToRoomRequest } from '../models/requests/addUserToRoom.type';
import { Room } from '../models/room.type';
import { Winner } from '../models/winner.type';
import { broadcastMessage } from '../utils/broadcastMessag';
import {
  createMessagePayload,
  sendMessageWithPayload,
} from '../utils/sendMessage';

export function handleMessage(ws: WebSocket, message: Message) {
  switch (message.type) {
    case MessageTypeEnum.REG:
      const onRegistrationSuccess = () => {
        broadcastRooms();
        broadcastWinners();
      };

      handleRegistration(ws, message, onRegistrationSuccess);
      break;
    case MessageTypeEnum.CREATE_ROOM:
      const onRoomCreated = (room: Room) => {
        const addUserToRoomPayload = createMessagePayload<AddUserToRoomRequest>(
          MessageTypeEnum.ADD_USER_TO_ROOM,
          { indexRoom: room.roomId }
        );

        if (addUserToRoomPayload) {
          handleUserAddingToRoom(ws, addUserToRoomPayload, broadcastRooms);
          sendMessageWithPayload(addUserToRoomPayload, ws);
        }
      };

      handleRoomCreation(message, onRoomCreated);
      break;
    case MessageTypeEnum.ADD_USER_TO_ROOM:
      const onUserAddedToRoom = (room: Room) => {
        if (isRoomFull(room)) {
          handleGameCreation(ws, room);
        }
        broadcastRooms();
      };

      handleUserAddingToRoom(ws, message, onUserAddedToRoom);
      break;
    case MessageTypeEnum.ADD_SHIPS:
      ws.send(
        JSON.stringify({ type: 'add_ships', data: { ships: message.data } })
      );
      break;
    case MessageTypeEnum.START_GAME:
      ws.send(
        JSON.stringify({ type: 'start_game', data: { gameId: message.data } })
      );
      break;
    case MessageTypeEnum.ATTACK:
      ws.send(
        JSON.stringify({ type: 'attack', data: { attackData: message.data } })
      );
      break;
    case MessageTypeEnum.RANDOM_ATTACK:
      ws.send(
        JSON.stringify({
          type: 'randomAttack',
          data: { attackData: message.data },
        })
      );
      break;
    case MessageTypeEnum.TURN:
      ws.send(
        JSON.stringify({ type: 'turn', data: { turnData: message.data } })
      );
      break;
    case MessageTypeEnum.FINISH:
      ws.send(
        JSON.stringify({ type: 'finish', data: { finishData: message.data } })
      );
      break;
  }
}

const broadcastWinners = () =>
  broadcastMessage<Winner[]>(MessageTypeEnum.UPDATE_WINNERS, getWinners());

const broadcastRooms = () =>
  broadcastMessage<Room[]>(MessageTypeEnum.UPDATE_ROOM, getRooms());
