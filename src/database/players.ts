import { randomUUID } from 'crypto';

import { Player } from '../models/player.type.js';

export const players = new Map<string, Player>();

export const createPlayer = (name: string, password: string): Player => {
  const index = randomUUID();
  const player = {
    name,
    password,
    wins: 0,
    index,
  };
  players.set(index, player);
  return player;
};

export const getPlayer = (index: string): Player | undefined => {
  return players.get(index);
};

export const getPlayerByName = (name: string): Player | undefined => {
  for (const player of players.values()) {
    if (player.name === name) {
      return player;
    }
  }
  return undefined;
};

export const updatePlayerWithCurrentGameId = (
  playerId: string,
  gameId: string | null
): Player | undefined => {
  const player = getPlayer(playerId);
  if (!player) {
    return undefined;
  }
  players.set(playerId, { ...player, currentGameId: gameId });
  return player;
};
