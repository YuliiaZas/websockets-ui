import { Game, GameStatus } from '../models/game.type.js';
import { Ship } from '../models/ship.type.js';
import { buildEnhancedShips } from '../utils/gameUtils.js';

export const games = new Map<string, Game>();

export const createGame = (gameId: string, players: string[]): Game => {
  const game: Game = {
    gameId,
    players,
    currentPlayerIndex: players[0],
    shipsInit: {},
    shipsCurrent: {},
    gameStatus: GameStatus.WAITING,
    winner: null,
  };

  games.set(gameId, game);

  return game;
};

export const addShips = (
  gameId: string,
  playerId: string,
  ships: Ship[]
): Game | undefined => {
  const game = games.get(gameId);
  if (!game) {
    return undefined;
  }

  const updatedGame: Game = {
    ...game,
    shipsInit: {
      ...game.shipsInit,
      [playerId]: ships,
    },
    shipsCurrent: {
      ...game.shipsCurrent,
      [playerId]: buildEnhancedShips(ships),
    },
  };
  console.log('Updated game:', updatedGame);

  games.set(gameId, updatedGame);

  return updatedGame;
};

export const isGameReady = (gameId: string): boolean => {
  const game = games.get(gameId);
  if (!game) {
    return false;
  }

  const playersWithShips = Object.keys(game.shipsInit);

  return game.players.every((playerId) => playersWithShips.includes(playerId));
};

export const getGame = (gameId: string): Game | undefined => {
  return games.get(gameId);
};

export const getEnemyIndex = (game: Game): string => {
  const currentPlayerIndex = game.players.indexOf(game.currentPlayerIndex);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  return game.players[nextPlayerIndex];
};

export const changeCurrentPlayer = (game: Game): Game => {
  const updatedGame = {
    ...game,
    currentPlayerIndex: getEnemyIndex(game),
  };
  games.set(game.gameId, updatedGame);
  return updatedGame;
};

export const changeGameStatus = (game: Game, gameStatus: GameStatus): Game => {
  const winner =
    gameStatus === GameStatus.FINISHED ? game.currentPlayerIndex : null;
  const updatedGame = {
    ...game,
    gameStatus,
    winner,
  };

  games.set(game.gameId, updatedGame);

  return updatedGame;
};
