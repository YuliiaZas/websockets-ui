import { WsServerMessageTypes } from "../const/ws-message-types.ts";
import { getAttackStatus, getEnemyId, isAllEnemyShipsKilled, getShipsByPlayers } from "../databases/games.ts";
import { setPlayerAsWinners } from "../databases/players.ts";
import { deepStringify } from "../helpers/stringify.ts";
import { WebSocketClients } from "../types/ws-clients.ts";
import { updateWinners } from "./update-winners.ts";

export const doAttack = (data: string, wsClients: WebSocketClients) => {
  const { gameId, x, y, indexPlayer } = JSON.parse(data);

  const status = getAttackStatus(gameId, indexPlayer, x, y)
  const attackRes = deepStringify({
    type: WsServerMessageTypes.attack,
    data: {
      position: { x, y },
      currentPlayer: indexPlayer,
      status,
    },
    id: 0,
  });

  let currentPlayer = indexPlayer;
  if (status === 'miss') {
    currentPlayer = getEnemyId(gameId, indexPlayer);
  }

  const turnRes = deepStringify({
    type: WsServerMessageTypes.turn,
    data: { currentPlayer },
    id: 0,
  })
  
  getShipsByPlayers(gameId).forEach((_: any, playerId: string) => {
    const client = wsClients.get(playerId);
    client?.ws.send(attackRes);
    client?.ws.send(turnRes);
  })

  if (status === 'shot' && isAllEnemyShipsKilled(gameId, indexPlayer)) {
    const finishRes = deepStringify({
      type: WsServerMessageTypes.finish,
      data: { indexPlayer },
      id: 0,
    })

    getShipsByPlayers(gameId).forEach((_: any, playerId: string) => {
      wsClients.get(playerId)?.ws.send(finishRes);
    })

    setPlayerAsWinners(indexPlayer);
    updateWinners(wsClients);
  }
}