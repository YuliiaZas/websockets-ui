import { randomUUID } from 'crypto';

const rooms = [];

export const getRoomById = roomId => 
  rooms.find(r => r.roomId === roomId);

export const getAvailableRooms = () => 
  rooms.filter(r => r.roomUsers.length === 1);

export const createRoom = () => {
  const roomId = randomUUID();
  rooms.push({
    roomId,
    roomUsers: []
  })
  return roomId;
}

export const addPlayerToRoomDb = (player, roomId) => {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].roomId === roomId) {
      rooms[i].roomUsers.push(player);
      break;
    }
  }
}