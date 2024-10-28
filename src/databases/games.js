import { randomUUID } from 'crypto';

const games = new Map();

export const createGameInDb = roomId => {
  const gameId = randomUUID();
  const gameValues = [...games.values()];
  if (!gameValues.some(g => g.roomId === roomId)) {
    games.set(gameId, {
      gameId,
      roomId,
      ships: new Map()
    })
    return gameId;
  }
  throw new Error(`A game for room with id ${roomId} already exists. Please join the existing game or use a different room.`)
}

export const addShipsToGame = (gameId, playerId, playerShips) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }
  if (!game.ships.has(playerId)) {
    game.ships.set(playerId, playerShips);
  } else {
    throw new Error(`A ships for player with id ${playerId} already exist.`);
  }
}

export const isGameReadyToStart = gameId => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }
  return game.ships.size === 2
}

export const getShipsByPlayers = gameId => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }
  return game.ships
}
