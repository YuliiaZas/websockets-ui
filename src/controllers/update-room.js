import { WsServerMessageTypes } from "../const/ws-message-types.js";
import { getAvailableRooms } from "../databases/rooms.js";
import { deepStringify } from "../helpers/stringify.js";

export const updateRoom = wss => {
  const updateRoomRes = deepStringify({
    type: WsServerMessageTypes.update_room,
    id: 0,
    data: getAvailableRooms(),
  })

  wss.clients.forEach(c => c.send(updateRoomRes));
}