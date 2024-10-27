import { getPlayerById } from "../databases/players.js";
import { addPlayerToRoomDb } from "../databases/rooms.js";

export const addPlayerToRoom = (clientId, roomId) => {
  const player = getPlayerById(clientId);
  addPlayerToRoomDb(player, roomId);
}