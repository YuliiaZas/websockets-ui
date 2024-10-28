import { WebSocket } from "ws";
import { WsServerMessageTypes } from "../const/ws-message-types.ts";
import { addPlayerToDb } from "../databases/players.ts";
import { deepStringify } from "../helpers/stringify.ts";
import { Player } from "../types/player.ts";

export const regPlayer = (clientId: string, name: string, ws: WebSocket) => {
  const player = { name, index: clientId } as Player;
  addPlayerToDb(player);

  const regRes = deepStringify({
    type: WsServerMessageTypes.reg,
    id: 0,
    data: player
  });

  ws.send(regRes);
}