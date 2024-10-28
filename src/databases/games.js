import { randomUUID } from 'crypto';

const games = new Map();

export const createGameInDb = roomId => {
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

const populateGrid = playerShips => {
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

export const addShipsToGame = (gameId, playerId, playerShips) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }
  if (!game.ships.has(playerId)) {
    game.ships.set(playerId, playerShips);
    const grid = populateGrid(playerShips);
    game.grids.set(playerId, grid);
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

export const getAttackStatus = (gameId, playerId, x, y) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }

  const enemyId = [...game.grids.keys()].find(id => id !== playerId);
  const cell = game.grids.get(enemyId)[y][x];
  cell.attacked = true;
  return cell.type ? 'shot' : 'miss';
}

export const getEnemyId = (gameId, playerId) => {
  const game = games.get(gameId);
  if (!game) {
    throw new Error(`Game with id ${gameId} does not exist.`);
  }

  return [...game.grids.keys()].find(id => id !== playerId);

}
