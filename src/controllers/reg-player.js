import { WsServerMessageTypes } from "../const/ws-message-types.js";
import { addPlayerToDb } from "../databases/players.js";
import { deepStringify } from "../helpers/stringify.js";

export const regPlayer = (clientId, name, ws) => {
  const player = { name, index: clientId };
  addPlayerToDb(player);

  const regRes = deepStringify({
    type: WsServerMessageTypes.reg,
    id: 0,
    data: player
  });

  ws.send(regRes);
}