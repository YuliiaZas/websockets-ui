import { randomUUID } from 'crypto';

import { Player } from '../models/player';

export const players = new Map<string, Player>();

export const createPlayer = (name: string, password: string): Player => {
  return {
    name,
    password,
    wins: 0,
    index: randomUUID(),
  };
};

export const savePlayer = (player: Player): void => {
  players.set(player.name, player);
};
