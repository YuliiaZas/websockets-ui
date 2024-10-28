import { Player } from "../types/player.ts";

const players: Player[] = [];

export const getPlayerById = (playerId: string): Player | undefined => 
  players.find(p => p.index === playerId)

export const addPlayerToDb = (player: Player) => 
  players.push({...player, wins: 0});

export const getWinners = () => 
  [...players].sort((a, b) => b.wins - a.wins);

export const setPlayerAsWinners = (playerId: string) => 
  players.forEach(p => {
    if (p.index === playerId) {
      p.wins++;
      return;
    }
  })
