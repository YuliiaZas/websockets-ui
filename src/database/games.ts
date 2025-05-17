import { Game } from '../models/game.type.js';
import { Ship } from '../models/ship.type.js';

export const games = new Map<string, Game>();

export const createGame = (gameId: string, players: string[]): Game => {
  const game: Game = {
    gameId,
    players,
    currentPlayerIndex: players[0],
    ships: {},
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

  const updatedGame = {
    ...game,
    ships: {
      ...game.ships,
      [playerId]: ships,
    },
  };

  games.set(gameId, updatedGame);

  return game;
};

export const isGameReady = (gameId: string): boolean => {
  const game = games.get(gameId);
  if (!game) {
    return false;
  }

  const playersWithShips = Object.keys(game.ships);

  return game.players.every((playerId) => playersWithShips.includes(playerId));
};
