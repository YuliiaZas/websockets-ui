import type { WebSocket } from 'ws';

import { createGame } from '../database/games';
import {
  deleteRoom,
  getRoomsIdsByPlayerId,
  removePlayerFromRoom,
} from '../database/rooms';
import { MessageTypeEnum } from '../models/message.type';
import { Room } from '../models/room.type';
import { broadcastMessage } from '../utils/broadcastMessag';

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
