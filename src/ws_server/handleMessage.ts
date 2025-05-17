import type { WebSocket } from 'ws';

import { handleAddShips } from '../commands/handleAddShips.js';
import { handleGameCreation } from '../commands/handleGameCreation.js';
import { handleRegistration } from '../commands/handleRegistration.js';
import { handleRoomCreation } from '../commands/handleRoomCreation.js';
import { handleUserAddingToRoom } from '../commands/handleUserAddingToRoom.js';
import { isGameReady } from '../database/games.js';
import { getRooms, isRoomFull } from '../database/rooms.js';
import { getWinners } from '../database/winners.js';
import { Game } from '../models/game.type.js';
import { Message, MessageTypeEnum } from '../models/message.type.js';
import { AddUserToRoomRequest } from '../models/requests/addUserToRoom.type.js';
import { StartGameResponse } from '../models/requests/startGame.type.js';
import { TurnResponse } from '../models/requests/turn.type.js';
import { Room } from '../models/room.type.js';
import { Winner } from '../models/winner.type.js';
import { broadcastMessage } from '../utils/broadcastMessag.js';
import {
  createMessagePayload,
  sendMessageWithPayload,
} from '../utils/sendMessage.js';

export function handleMessage(ws: WebSocket, message: Message) {
  console.log(
    `\n--> Received comnand: '${message.type}' from (${ws.player?.index || 'current'}) player`
  );

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
      const onShipsAdded = (game: Game) => {
        if (isGameReady(game.gameId)) {
          broadcastMessage<StartGameResponse>(
            MessageTypeEnum.START_GAME,
            {
              ships: game.ships[ws.player!.index],
              currentPlayerIndex: game.currentPlayerIndex,
            },
            game.players
          );
          broadcastGameTurn(game);
        }
      };
      handleAddShips(message, onShipsAdded);
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

const broadcastGameTurn = (game: Game) =>
  broadcastMessage<TurnResponse>(
    MessageTypeEnum.TURN,
    { currentPlayer: game.currentPlayerIndex },
    game.players
  );
