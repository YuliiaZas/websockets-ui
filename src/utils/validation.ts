import { AddShipsRequest } from '../models/requests/addShips.type.js';
import { AddUserToRoomRequest } from '../models/requests/addUserToRoom.type.js';
import { AttackRequest } from '../models/requests/attack.type.js';
import { RegistrationRequest } from '../models/requests/registration.type.js';
import { Ship, ShipType } from '../models/ship.type.js';

export function isRegistrationRequest(
  data: unknown
): data is RegistrationRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'password' in data &&
    typeof (data as RegistrationRequest).name === 'string' &&
    typeof (data as RegistrationRequest).password === 'string'
  );
}

export function isCreateRoomRequest(
  data: unknown
): data is AddUserToRoomRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'indexRoom' in data &&
    typeof (data as AddUserToRoomRequest).indexRoom === 'string'
  );
}

export function isAddShipsRequest(data: unknown): data is AddShipsRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'gameId' in data &&
    'indexPlayer' in data &&
    'ships' in data &&
    typeof (data as AddShipsRequest).gameId === 'string' &&
    typeof (data as AddShipsRequest).indexPlayer === 'string' &&
    Array.isArray((data as AddShipsRequest).ships) &&
    (data as AddShipsRequest).ships.every((ship) => isShip(ship))
  );
}

export function isShip(data: unknown): data is Ship {
  return (
    typeof data === 'object' &&
    data !== null &&
    'position' in data &&
    'direction' in data &&
    'length' in data &&
    'type' in data &&
    typeof (data as Ship).position === 'object' &&
    (data as Ship).position !== null &&
    'x' in (data as Ship).position &&
    'y' in (data as Ship).position &&
    typeof (data as Ship).position.x === 'number' &&
    typeof (data as Ship).position.y === 'number' &&
    typeof (data as Ship).direction === 'boolean' &&
    typeof (data as Ship).length === 'number' &&
    typeof (data as Ship).type === 'string' &&
    Object.values(ShipType).includes((data as Ship).type)
  );
}

export function isAttackRequest(data: unknown): data is AttackRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'gameId' in data &&
    'indexPlayer' in data &&
    'x' in data &&
    'y' in data &&
    typeof (data as AttackRequest).gameId === 'string' &&
    typeof (data as AttackRequest).indexPlayer === 'string' &&
    typeof (data as AttackRequest).x === 'number' &&
    typeof (data as AttackRequest).y === 'number'
  );
}
