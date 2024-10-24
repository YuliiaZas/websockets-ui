import { error } from 'node:console'
import ws from 'ws'
import { Message, Player } from './types/MessageTypes'
import { handleRegister } from './handlers/handleRegister'

const webSocketServer = new ws.Server({ port: 3000 })

const users = new Map<Player['name'], Player>([
    [
        'Alimusim',
        {
            name: 'Alimusim',
            password: '12345',
            index: 0,
        },
    ],
])
webSocketServer.on('connection', (ws) => {
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message.toString()) as Message
        switch (parsedMessage.type) {
            case 'reg':
                handleRegister(parsedMessage, ws, users)
                break
            case 'create_game':
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
