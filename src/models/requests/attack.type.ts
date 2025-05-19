export enum AttackStatus {
  MISS = 'miss',
  SHOT = 'shot',
  KILLED = 'killed',
}

export type AttackRequest = {
  gameId: string;
  indexPlayer: string;
  x: number;
  y: number;
};

export type AttackResponse = {
  position: {
    x: number;
    y: number;
  };
  currentPlayer: string;
  status: AttackStatus;
};
