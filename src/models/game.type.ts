import { AttackStatus } from './requests/attack.type.js';
import { EnhancedShip, Ship } from './ship.type.js';

export enum GameStatus {
  WAITING = 'waiting',
  STARTED = 'started',
  FINISHED = 'finished',
}

export type Game = {
  gameId: string;
  players: string[];
  currentPlayerIndex: string;
  currentAttackStatus?: AttackStatus | null;
  shipsCurrent: {
    [indexPlayer: string]: EnhancedShip[];
  };
  shipsInit: {
    [indexPlayer: string]: Ship[];
  };
  gameStatus: GameStatus;
  winner: string | null;
};
