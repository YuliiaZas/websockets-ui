import { WsServerMessageTypes } from "../const/ws-message-types.ts";
import { getWinners } from "../databases/players.ts";
import { deepStringify } from "../helpers/stringify.ts";
import { WebSocketClients } from "../types/ws-clients.ts";

export const updateWinners = (wsClients: WebSocketClients) => {
  const updateWinnersRes = deepStringify({
    type: WsServerMessageTypes.update_winners,
    id: 0,
    data: getWinners(),
  })

  wsClients.forEach(c => c.ws.send(updateWinnersRes));
}