import { error } from 'node:console'
import ws from 'ws'

const webSocketServer = new ws.Server({ port: 3000 })
type MessageType =
    | 'reg'
    | 'create_game'
    | 'start_game'
    | 'turn'
    | 'attack'
    | 'finish'
    | 'update_room'
    | 'update_winners'
interface Message {
    type: MessageType
    data: object
    id: 0
}
interface Player {
    name: string
    password: string
    index: number | string
}
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
                const Player = JSON.parse(
                    parsedMessage.data.toString()
                ) as Omit<Player, 'index'>
                if (users.has(Player.name)) {
                    const user = users.get(Player.name)
                    ws.send(
                        JSON.stringify({
                            type: 'reg',
                            data: {
                                name: user?.name,
                                index: user?.index,
                                error: false,
                            },
                            id: 0,
                        })
                    )
                }
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
        }
    })
})

webSocketServer.on('close', () => {
    console.log('Client disconnected')
})
