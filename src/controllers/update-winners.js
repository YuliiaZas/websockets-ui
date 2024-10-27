import { WsServerMessageTypes } from "../const/ws-message-types.js";
import { getWinners } from "../databases/players.js";
import { deepStringify } from "../helpers/stringify.js";

export const updateWinners = wss => {
  const updateWinnersRes = deepStringify({
    type: WsServerMessageTypes.update_winners,
    id: 0,
    data: getWinners(),
  })

  wss.clients.forEach(c => c.send(updateWinnersRes));
}