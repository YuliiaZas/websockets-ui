import { getEnemyGrid } from "../databases/games.js";
import { doAttack } from "./do-attack.js";

const getRandomAttackPosition = grid => {
  let x, y;
  do {
    x = Math.floor(Math.random() * 9);
    y = Math.floor(Math.random() * 9);
  } while (grid[y][x].attacked);

  return { x, y };
}

export const doRandomAttack = (data, clients) => {
  const { gameId, indexPlayer } = JSON.parse(data);
  const grid = getEnemyGrid(gameId, indexPlayer);
  const {x, y} = getRandomAttackPosition(grid);

  doAttack(JSON.stringify({gameId, indexPlayer, x, y}), clients)
}