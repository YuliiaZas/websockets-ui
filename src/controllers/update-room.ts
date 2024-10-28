import { WsServerMessageTypes } from "../const/ws-message-types.ts";
import { getAvailableRooms } from "../databases/rooms.ts";
import { deepStringify } from "../helpers/stringify.ts";
import { WebSocketClients } from "../types/ws-clients.ts";

export const updateRoom = (wsClients: WebSocketClients) => {
  const updateRoomRes = deepStringify({
    type: WsServerMessageTypes.update_room,
    id: 0,
    data: getAvailableRooms(),
  })

  wsClients.forEach(c => c.ws.send(updateRoomRes));
}