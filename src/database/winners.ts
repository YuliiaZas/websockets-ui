import { Winner } from '../models/winner.type.js';
import { getPlayer } from './players.js';

export const winners = new Map<string, Winner>();

export const updateWinsForPlayer = (playerId: string) => {
  const currentWinner = winners.get(playerId) || {
    name: getPlayer(playerId)?.name ?? '',
    wins: 0,
  };
  winners.set(playerId, {
    ...currentWinner,
    wins: currentWinner.wins + 1,
  });
};

export const getWinnersTable = (): Winner[] => {
  const sortedWinners = [...winners.values()].sort((a, b) => b.wins - a.wins);
  return sortedWinners.map((winner) => ({
    name: winner.name,
    wins: winner.wins,
  }));
};
