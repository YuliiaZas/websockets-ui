import { WebSocketServer } from "ws";
import { getPlayerById } from "../databases/players.ts";
import { addPlayerToRoomDb, createRoom } from "../databases/rooms.ts";
import { updateRoom } from "./update-room.ts";
import { WebSocketClients } from "../types/ws-clients.ts";

export const createRoomAndAddPlayerToRoom = (playerId: string, wsClients: WebSocketClients) => {
  const roomId = createRoom();
  const player = getPlayerById(playerId);
  addPlayerToRoomDb(player, roomId);

  updateRoom(wsClients);
}