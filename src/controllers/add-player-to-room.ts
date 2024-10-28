import { getPlayerById } from "../databases/players.ts";
import { addPlayerToRoomDb } from "../databases/rooms.ts";

export const addPlayerToRoom = (clientId: string, roomId: string) => {
  const player = getPlayerById(clientId);
  addPlayerToRoomDb(player, roomId);
}