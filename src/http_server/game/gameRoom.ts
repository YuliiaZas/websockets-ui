import { players, rooms } from '../db.ts';
import {v4 as uid} from 'uuid';

export const createRoom = (playerId: string) => {
    const roomId = uid();
    roomId.set(roomId, {id:roomId, players: [{playerId}], gameState: null});
    return roomId;
}

export const joinRoom = (playerId: string, roomId: string) => {
    const room = rooms.get(roomId);
    const player = players.get(playerId);
    if (!player) {
        console.log(`Player with ID ${playerId} does not exist`);
        return false;
    }
    if(room && room.players.length < 2) {
        room.players.push(player);
        return true;
    }
    return false;
}