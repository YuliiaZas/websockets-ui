import { Game } from '../models/game.type.js';

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
