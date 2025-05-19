import { Ship } from '../ship.type.js';

export type StartGameResponse = {
  currentPlayerIndex: string;
  ships: Ship[];
};
