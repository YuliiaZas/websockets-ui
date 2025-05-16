import { Ship } from './ship.type';

export type Game = {
  gameId: string;
  players: string[];
  currentPlayerIndex: string;
  ships: {
    [indexPlayer: string]: Ship[];
  };
};
