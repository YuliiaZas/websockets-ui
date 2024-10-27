import { WsServerMessageTypes } from "../const/ws-message-types.js";
import { createGameInDb } from "../databases/games.js";
import { getRoomById } from "../databases/rooms.js"
import { deepStringify } from "../helpers/stringify.js";

export const createGame = (roomId, wss) => {
  const { roomUsers } = getRoomById(roomId);
  const roomUsersIds = roomUsers.map(u => u.index);
  const gameId = createGameInDb(roomId);

  let usersNotified = 0;

  for (const c of wss.clients) {
    if (roomUsersIds.includes(c.id)) {
      c.send(deepStringify({
        type: WsServerMessageTypes.create_game,
        data: {
          idGame: gameId,
          idPlayer: c.id
        },
        id: 0
      }));
      usersNotified++;

      if (usersNotified === roomUsersIds.length) {
        break;
      }
    }
  }

}