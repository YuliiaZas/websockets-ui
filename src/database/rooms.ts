import { randomUUID } from 'crypto';

import { Player } from '../models/player.type';
import { Room } from '../models/room.type';

export const MAX_ROOM_PLAYERS = 2;

export const rooms = new Map<string, Room>();

export const createRoom = (): Room => {
  const room: Room = {
    roomId: randomUUID(),
    roomUsers: [],
  };
  rooms.set(room.roomId, room);
  return room;
};

export const deleteRoom = (roomId: string): void => {
  rooms.delete(roomId);
};

export const addPlayerToRoom = (roomId: string, player?: Player): Room => {
  const room = rooms.get(roomId);

  if (!room) {
    throw new Error(`Room with ID ${roomId} not found`);
  }
  if (!player) {
    throw new Error(
      `Unknown player could not be added to the room with ID ${roomId}`
    );
  }
  if (room.roomUsers.length >= MAX_ROOM_PLAYERS) {
    throw new Error(`Room with ID ${roomId} is full`);
  }

  const playerInRoom = room.roomUsers.find((user) => user.name === player.name);
  if (playerInRoom) {
    throw new Error(
      `Player ${player.name} is already in the room with ID ${roomId}`
    );
  }

  const updatedRoom = {
    ...room,
    roomUsers: [...room.roomUsers, { name: player.name, index: player.index }],
  };

  rooms.set(room.roomId, updatedRoom);
  return updatedRoom;
};

export const getRooms = (): Room[] => {
  return [...rooms.values()];
};

export const getRoom = (roomId: string): Room | undefined => {
  return rooms.get(roomId);
};

export const getRoomsIdsByPlayerId = (playerId: string): string[] => {
  const playerRoomsIds: string[] = [];
  for (const room of rooms.values()) {
    if (room.roomUsers.some((user) => user.index === playerId)) {
      playerRoomsIds.push(room.roomId);
    }
  }
  return playerRoomsIds;
};

export const removePlayerFromRoom = (
  roomId: string,
  playerId: string
): Room => {
  const room = rooms.get(roomId);

  if (!room) {
    throw new Error(`Room with ID ${roomId} not found`);
  }

  const updatedRoom = {
    ...room,
    roomUsers: room.roomUsers.filter((user) => user.index !== playerId),
  };

  rooms.set(room.roomId, updatedRoom);
  return updatedRoom;
};

export const isRoomFull = (room: Room): boolean => {
  return room.roomUsers.length >= MAX_ROOM_PLAYERS;
};
