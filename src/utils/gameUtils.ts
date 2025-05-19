import { getEnemyIndex } from '../database/games.js';
import { Game } from '../models/game.type.js';
import { AttackStatus } from '../models/requests/attack.type.js';
import { EnhancedShip, Ship } from '../models/ship.type.js';

const boardSize = 10;

export function buildEnhancedShips(ships: Ship[]): EnhancedShip[] {
  return ships.map((ship) => {
    const cells = new Set<string>();
    for (let i = 0; i < ship.length; i++) {
      const x = ship.position.x + (ship.direction ? 0 : i);
      const y = ship.position.y + (ship.direction ? i : 0);
      cells.add(`${x},${y}`);
    }

    const emptyCellsAround: [number, number][] = getEmptyCellsArroundShip(ship);

    return { ...ship, cells, emptyCellsAround, hits: new Set<string>() };
  });
}

export function processAttack(
  game: Game,
  x: number,
  y: number
): {
  status: AttackStatus;
  cellsArround?: [number, number][];
  allShipCells?: [number, number][];
  isAllSunk?: boolean;
} | null {
  const playerId = game.currentPlayerIndex;
  const enemyIndex = getEnemyIndex(game);
  const enhancedShips = game.shipsCurrent[enemyIndex];
  if (!enhancedShips) {
    return null;
  }

  const key = `${x},${y}`;

  if (!game.attackHistory[playerId]) {
    game.attackHistory[playerId] = new Set<string>();
  }

  if (game.attackHistory[playerId].has(key)) {
    throw new Error(
      `Cell (${x}, ${y}) has already been attacked by this player.`
    );
  }

  game.attackHistory[playerId].add(key);

  for (let i = 0; i < enhancedShips.length; i++) {
    const ship = enhancedShips[i];

    if (ship.cells.has(key)) {
      ship.hits.add(key);
      const isKilled = ship.hits.size === ship.cells.size;

      if (isKilled) {
        game.shipsCurrent[enemyIndex] = [
          ...enhancedShips.slice(0, i),
          ...enhancedShips.slice(i + 1),
        ];

        for (const [xEmpty, yEmpty] of ship.emptyCellsAround) {
          game.attackHistory[playerId].add(`${xEmpty},${yEmpty}`);
        }

        return {
          status: AttackStatus.KILLED,
          cellsArround: ship.emptyCellsAround,
          allShipCells: Array.from(ship.cells).map((cell) => {
            return cell.split(',').map(Number) as [number, number];
          }),
          isAllSunk: game.shipsCurrent[enemyIndex].length === 0,
        };
      }
      return { status: AttackStatus.SHOT };
    }
  }
  return { status: AttackStatus.MISS };
}

export function getRandomAttackCoordinates(
  game: Game
): { x: number; y: number } | null {
  const playerId = game.currentPlayerIndex;
  const attacked = game.attackHistory[playerId] ?? new Set<string>();

  const maxAttempts = boardSize * boardSize;

  for (let i = 0; i < maxAttempts; i++) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    const key = `${x},${y}`;

    if (!attacked.has(key)) {
      return { x, y };
    }
  }

  return null;
}

function getEmptyCellsArroundShip(ship: Ship): [number, number][] {
  const emptyCellsAroundShip: [number, number][] = [];

  for (let i = -1; i <= ship.length; i++) {
    const x = ship.position.x + (ship.direction ? 0 : i);
    const y = ship.position.y + (ship.direction ? i : 0);
    const currentCellsAround: [number, number][] = [];

    if (i === -1 || i === ship.length) {
      currentCellsAround.push([x, y]);
    }
    if (ship.direction) {
      currentCellsAround.push([x - 1, y]);
      currentCellsAround.push([x + 1, y]);
    } else {
      currentCellsAround.push([x, y - 1]);
      currentCellsAround.push([x, y + 1]);
    }

    emptyCellsAroundShip.push(
      ...currentCellsAround.filter((cell) => {
        return isCellInsideField(cell);
      })
    );
  }

  return emptyCellsAroundShip;
}

function isCellInsideField([x, y]: [number, number]) {
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}
