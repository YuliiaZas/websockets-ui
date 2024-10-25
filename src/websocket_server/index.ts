import ws from 'ws'
import { Message, Player } from './types/messageTypes'
import { handleRegister } from './handlers/handleRegister'
import { createRoom, Room, updateRoomForAll } from './helpers/updateRoomForAll'
import { updateWinnersForAll, Winner } from './helpers/updateWinnersForAll'
import { addUserToRoom } from './helpers/addUserToRoom'
import { createGame } from './helpers/createGame'

const webSocketServer = new ws.Server({ port: 3000 })

const users = new Map<Player['name'], Player>()
const wsToPlayerName = new Map<ws, Player['name']>()
const rooms = new Map<string, Room>()
const winners = new Map<Player['name'], Winner>()
webSocketServer.on('connection', (ws, req) => {
    console.log(req.socket.remoteAddress)
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
            case 'add_user_to_room':
                const indexRoom = JSON.parse(parsedMessage.data).indexRoom
                addUserToRoom({
                    ws,
                    rooms,
                    users,
                    wsToPlayerName,
                    indexRoom,
                })
                updateRoomForAll(webSocketServer, Array.from(rooms.values()))
                createGame(users, rooms, indexRoom)
                break
            case 'add_ships':
                console.log(parsedMessage)
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
