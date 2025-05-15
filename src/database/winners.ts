import { WinnersResponse } from '../entities/winners.type';
import { Player } from '../models/player';

export const winners = new Map<string, number>();

export const updateWinners = (player: Player) => {
  const currentWins = winners.get(player.name) || 0;
  winners.set(player.name, currentWins + player.wins);
};

export const getWinners = (): WinnersResponse[] => {
  const sortedWinners = [...winners.entries()].sort(([, a], [, b]) => b - a);
  return sortedWinners.map(([name, wins]) => ({ name, wins }));
};
