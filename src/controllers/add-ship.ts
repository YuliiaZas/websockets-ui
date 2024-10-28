
import { addShipsToGame, getShipsByPlayers, isGameReadyToStart } from "../databases/games.ts"
import { deepStringify } from '../helpers/stringify.ts';
import { WsServerMessageTypes } from '../const/ws-message-types.ts';
import { Ship } from "../types/ship";
import { WebSocketClients } from "../types/ws-clients.ts";

export const addShips = (
  gameId: string,
  playerId: string,
  playerShips: Ship[],
  clients: WebSocketClients
) => {
  addShipsToGame(gameId, playerId, playerShips);

  const getStartGameResponse = (playerId: string, ships: Ship[]) => {
    return deepStringify({
      type: WsServerMessageTypes.start_game,
      data: {
        ships,
        currentPlayerIndex: playerId
      },
      id: 0,
    })
  }

  const getTurnResponse = (firstTurnPlayerId: string) => {
    return deepStringify({
      type: WsServerMessageTypes.turn,
      data: {
        currentPlayer: firstTurnPlayerId
      },
      id: 0,
    })
  }

  if (isGameReadyToStart(gameId)) {
    const firstTurnPlayerId = [...getShipsByPlayers(gameId)][0][0];
    getShipsByPlayers(gameId).forEach((ships: Ship[], playerId: string) => {
      const startGameRes = getStartGameResponse(playerId, ships)
      clients.get(playerId)?.ws.send(startGameRes);
    })

    getShipsByPlayers(gameId).forEach((_: any, playerId: string) => {
      const turnRes = getTurnResponse(firstTurnPlayerId)
      clients.get(playerId)?.ws.send(turnRes);
    })
  }
  
}