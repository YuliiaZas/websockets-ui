import { randomUUID } from 'crypto';

const games = [];

export const createGameInDb = (roomId) => {
  const gameId = randomUUID()
  games.push({
    gameId,
    roomId,
    ships: []
  })
  return gameId;
}

export const addShips = (gameId, ships) => {
  games = games.map(g => {
    if (g.gameId === gameId) {
      return {...g, ships};
    } 
    return g
  })
}