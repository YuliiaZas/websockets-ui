import { getEnemyIndex } from '../database/games.js';
import { Game } from '../models/game.type.js';
import { AttackStatus } from '../models/requests/attack.type.js';
import { EnhancedShip, Ship } from '../models/ship.type.js';

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
  const enemyIndex = getEnemyIndex(game);
  const enhancedShips = game.shipsCurrent[enemyIndex];
  if (!enhancedShips) {
    return null;
  }

  const key = `${x},${y}`;

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
  return x >= 0 && x < 10 && y >= 0 && y < 10;
}
