import { getPlayerById } from "../databases/players.js";
import { addPlayerToRoomDb, createRoom } from "../databases/rooms.js";
import { updateRoom } from "./update-room.js";

export const createRoomAndAddPlayerToRoom = (playerId, wss) => {
  const roomId = createRoom();
  const player = getPlayerById(playerId);
  addPlayerToRoomDb(player, roomId);

  updateRoom(wss);
}