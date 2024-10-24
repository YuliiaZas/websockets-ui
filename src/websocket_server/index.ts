import ws from 'ws'
import { Message, Player } from './types/messageTypes'
import { handleRegister } from './handlers/handleRegister'
import { createRoom, Room, updateRoomForAll } from './helpers/updateRoomForAll'
import { updateWinnersForAll, Winner } from './helpers/updateWinnersForAll'

const webSocketServer = new ws.Server({ port: 3000 })

const users = new Map<Player['name'], Player>()
const wsToPlayerName = new Map<ws, Player['name']>()
const rooms = new Map<ws, Room>()
const winners = new Map<Player['name'], Winner>()
webSocketServer.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString()) as Message

        switch (parsedMessage.type) {
            case 'reg':
                const data = JSON.parse(parsedMessage.data)
                handleRegister(data, ws, users, wsToPlayerName)
                updateRoomForAll(webSocketServer, Array.from(rooms.values()))
                updateWinnersForAll(
                    webSocketServer,
                    Array.from(winners.values())
                )
                break
            case 'create_room':
                createRoom(ws, rooms, users, wsToPlayerName)
                updateRoomForAll(webSocketServer, Array.from(rooms.values()))
                break
            case 'start_game':
                break
            case 'turn':
                break
            case 'attack':
                break
            case 'finish':
                break
            case 'update_room':
                break
            case 'update_winners':
                break
            default:
                ws.close(500, 'Wrong message type')
        }
    })
})

webSocketServer.on('close', () => {
    console.log('Client disconnected')
})
