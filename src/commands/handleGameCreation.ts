import type { WebSocket } from 'ws';

import { createGame } from '../database/games.js';
import {
  deleteRoom,
  getRoomsIdsByPlayerId,
  removePlayerFromRoom,
} from '../database/rooms.js';
import { MessageTypeEnum } from '../models/message.type.js';
import { Room } from '../models/room.type.js';
import { broadcastMessage } from '../utils/broadcastMessag.js';

export function handleGameCreation(ws: WebSocket, room: Room) {
  const gamePlayresIds = room.roomUsers.map((user) => user.index);

  const game = createGame(room.roomId, gamePlayresIds);

  broadcastMessage(
    MessageTypeEnum.CREATE_GAME,
    { idGame: game.gameId, idPlayer: ws.player!.index },
    gamePlayresIds
  );

  deleteRoom(room.roomId);
  removePlayersFromOterRooms(gamePlayresIds);
}

function removePlayersFromOterRooms(gamePlayresIds: string[]) {
  gamePlayresIds.forEach((playerId) => {
    const playerRoomsIds = getRoomsIdsByPlayerId(playerId);

    playerRoomsIds.forEach((roomId) => removePlayerFromRoom(roomId, playerId));
  });
}
