import { Message, Player } from '../types/MessageTypes'
import ws from 'ws'

const activePlayers = new Set<Player['name']>()

interface sendRegResponseData {
    name: string
    index: number | string
}
const sendRegResponse = (
    ws: ws,
    { name, index }: sendRegResponseData,
    error?: string
) => {
    ws.send(
        JSON.stringify({
            type: 'reg',
            data: JSON.stringify({
                name,
                index,
                error: Boolean(error),
                errorText: error,
            }),
            id: 0,
        })
    )
}
export const handleRegister = (
    parsedMessage: Message,
    ws: ws,
    users: Map<string, Player>
) => {
    const Player = JSON.parse(parsedMessage.data.toString()) as Player
    const { name, index, password } = Player
    if (users.has(name) && activePlayers.has(name)) {
        sendRegResponse(
            ws,
            { name, index },
            'User already exists and is active'
        )
    } else if (users.has(name)) {
        const PlayerDataFromBase = users.get(name) as Player
        if (PlayerDataFromBase.password === password) {
            activePlayers.add(name)
            sendRegResponse(ws, { name, index })
        } else {
            sendRegResponse(ws, { name, index }, 'Wrong password')
        }
    } else {
        users.set(name, Player)
        sendRegResponse(ws, { name, index })
        activePlayers.add(name)
    }

    ws.on('close', () => {
        activePlayers.delete(name)
    })
}
