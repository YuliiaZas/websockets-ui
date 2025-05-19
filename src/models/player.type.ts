export type Player = {
  index: string;
  name: string;
  password: string;
  wins: number;
  currentGameId?: string | null;
};
