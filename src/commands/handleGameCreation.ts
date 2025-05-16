import type { WebSocket } from 'ws';

import { createGame } from '../database/games';
import { deleteRoom } from '../database/rooms';
import { MessageTypeEnum } from '../models/message.type';
import { Room } from '../models/room.type';
import { broadcastMessage } from '../utils/broadcastMessag';

export function handleGameCreation(ws: WebSocket, room: Room) {
  const gamePlayres = room.roomUsers.map((user) => user.index);

  const game = createGame(room.roomId, gamePlayres);

  broadcastMessage(
    MessageTypeEnum.CREATE_GAME,
    { idGame: game.gameId, idPlayer: ws.player!.index },
    gamePlayres
  );

  deleteRoom(room.roomId);
}
