import { WsServerMessageTypes } from "../const/ws-message-types.ts";
import { createGameInDb } from "../databases/games.ts";
import { getRoomById } from "../databases/rooms.ts"
import { deepStringify } from "../helpers/stringify.ts";
import { WebSocketClients } from "../types/ws-clients.ts";

export const createGame = (roomId: string, wss: WebSocketClients) => {
  const { roomUsers } = getRoomById(roomId);
  const roomUsersIds = roomUsers.map(u => u.index);
  const gameId = createGameInDb(roomId);

  roomUsersIds.forEach((userId: string) => {
    const userWs = wss.get(userId);
    if (userWs) {
      const createGameRes = deepStringify({
        type: WsServerMessageTypes.create_game,
        data: {
          idGame: gameId,
          idPlayer: userId
        },
        id: 0
      });
      userWs.ws.send(createGameRes);
    }
  }) 
}