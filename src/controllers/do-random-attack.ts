import { getEnemyGrid } from "../databases/games.ts";
import { Grid } from "../types/grid";
import { WebSocketClients } from "../types/ws-clients.ts";
import { doAttack } from "./do-attack.ts";

const getRandomAttackPosition = (grid: Grid) => {
  let x, y;
  do {
    x = Math.floor(Math.random() * 9);
    y = Math.floor(Math.random() * 9);
  } while (grid[y][x].attacked);

  return { x, y };
}

export const doRandomAttack = (data: string, clients: WebSocketClients) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  const grid = getEnemyGrid(gameId, indexPlayer);
  const {x, y} = getRandomAttackPosition(grid);

  doAttack(JSON.stringify({gameId, indexPlayer, x, y}), clients)
}