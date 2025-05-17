import { Ship } from '../ship.type.js';

export type AddShipsRequest = {
  gameId: string;
  indexPlayer: string;
  ships: Ship[];
};
