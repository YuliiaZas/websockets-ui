import { randomUUID } from 'crypto';

import { Player } from '../models/player.type';

export const players = new Map<string, Player>();

export const createPlayer = (name: string, password: string): Player => {
  const player = {
    name,
    password,
    wins: 0,
    index: randomUUID(),
  };
  players.set(player.name, player);
  return player;
};

export const getPlayer = (name: string): Player | undefined => {
  return players.get(name);
};
