import { randomUUID } from 'crypto';
import { Ship } from '../types/ship';

const games = new Map();

export const createGameInDb = (roomId: string) => {
  const gameId = randomUUID();
  const gameValues = [...games.values()];
  if (!gameValues.some(g => g.roomId === roomId)) {
    games.set(gameId, {
      gameId,
      roomId,
      ships: new Map(),
      grids: new Map(),
    })
    return gameId;
  }
  throw new Error(`A game for room with id ${roomId} already exists. Please join the existing game or use a different room.`)
}

const populateGrid = (playerShips: Ship[]) => {
  const grid = Array.from({ length: 10 }, () => Array(10).fill({type: null, attacked: false}));

  playerShips.forEach(ship => {
    const { x, y } = ship.position;
    const { direction, length, type } = ship;

    for (let i = 0; i < length; i++) {
      if (direction) {
        grid[y + i][x] = {type, attacked: false}
      } else {
        grid[y][x + i] = {type, attacked: false};
      }
    }
  });

  return grid;
};

const getGameById = (gameId: string) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }
  return game;
}

export const addShipsToGame = (gameId: string, playerId: string, playerShips: Ship[]) => {
  const game = getGameById(gameId);
  if (!game.ships.has(playerId)) {
    game.ships.set(playerId, playerShips);
    const grid = populateGrid(playerShips);
    game.grids.set(playerId, grid);
  } else {
    throw new Error(`A ships for player with id ${playerId} already exist.`);
  }
}

export const isGameReadyToStart = (gameId: string) => {
  const game = getGameById(gameId);
  return game.ships.size === 2
}

export const getShipsByPlayers = (gameId: string) => getGameById(gameId).ships;

export const getAttackStatus = (gameId: string, playerId: string, x: number, y: number) => {
  const game = getGameById(gameId);
  const enemyId = [...game.grids.keys()].find(id => id !== playerId);
  const cell = game.grids.get(enemyId)[y][x];
  cell.attacked = true;
  return cell.type ? 'shot' : 'miss';
}

export const getEnemyId = (gameId: string, playerId: string) => {
  const game = getGameById(gameId);
  return [...game.grids.keys()].find(id => id !== playerId);
}

export const getEnemyGrid = (gameId: string, playerId: string) => {
  const game = getGameById(gameId);
  const enemyId = [...game.grids.keys()].find(id => id !== playerId);
  return game.grids.get(enemyId);
}

export const isAllEnemyShipsKilled = (gameId: string, playerId: string) => {
  const game = getGameById(gameId);
  const enemyId = [...game.grids.keys()].find(id => id !== playerId);
  const enemyGrid = game.grids.get(enemyId);
  let killCount = 0;

  for (let row of enemyGrid) {
    for (let cell of row) {
      if (cell.type && cell.attacked) {
        killCount += 1;
      }
    }
  }

  return killCount === 20;
}
