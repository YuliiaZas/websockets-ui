import { randomUUID } from 'crypto';
import { Room } from '../types/room';
import { Player } from '../types/player';

const rooms: Room[] = [];

export const getRoomById = (roomId: string) => 
  rooms.find(r => r.roomId === roomId) as Room;

export const getAvailableRooms = (): Room[] => 
  rooms.filter(r => r.roomUsers.length === 1);

export const createRoom = () => {
  const roomId = randomUUID();
  rooms.push({
    roomId,
    roomUsers: []
  })
  return roomId;
}

export const addPlayerToRoomDb = (player: Player | undefined, roomId: string) => {
  if (player) {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].roomId === roomId) {
        rooms[i].roomUsers.push(player);
        break;
      }
    }
  }
}