import { randomUUID } from 'node:crypto'
import { WebSocketServer } from 'ws'
import { Player } from '../types/messageTypes'
import ws from 'ws'
const createUpdateRoomResponse = (rooms: Room[]) => {
    return JSON.stringify({
        type: 'update_room',
        data: JSON.stringify(rooms),
        id: 0,
    })
}
export const createRoom = (
    ws: ws,
    rooms: Map<ws, Room>,
    users: Map<Player['name'], Player>,
    wsToPlayerName: Map<ws, Player['name']>
) => {
    if (rooms.has(ws)) return
    const playerName = wsToPlayerName.get(ws) as string
    const player = users.get(playerName) as Player
    const roomId = randomUUID()
    rooms.set(ws, {
        roomId,
        roomUsers: [{ name: player.name, index: player.index }],
    })
}
export const updateRoomForAll = (wss: WebSocketServer, rooms: Room[]) => {
    const response = createUpdateRoomResponse(rooms)
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(response)
        }
    })
}
export interface Room {
    roomId: number | string
    roomUsers: [
        {
            name: string
            index: number | string
        }
    ]
}
