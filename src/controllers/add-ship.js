
import { addShipsToGame, getShipsByPlayers, isGameReadyToStart } from "../databases/games.js"
import { deepStringify } from '../helpers/stringify.js';
import { WsServerMessageTypes } from '../const/ws-message-types.js';

export const addShips = (gameId, playerId, playerShips, clients) => {
  addShipsToGame(gameId, playerId, playerShips);

  const getStartGameResponse = (playerId, ships) => {
    return deepStringify({
      type: WsServerMessageTypes.start_game,
      data: {
        ships,
        currentPlayerIndex: playerId
      },
      id: 0,
    })
  }

  if (isGameReadyToStart(gameId)) {
    getShipsByPlayers(gameId).forEach((ships, playerId) => {
      const startGameRes = getStartGameResponse(playerId, ships)
      clients.get(playerId).send(startGameRes);
    })
  }
  
}