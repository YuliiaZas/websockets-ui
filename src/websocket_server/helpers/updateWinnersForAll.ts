import { WebSocketServer } from 'ws'
export interface Winner {
    name: string
    wins: number
}
const createUpdateWinnersResponse = (winners: Winner[]) => {
    return JSON.stringify({
        type: 'update_winners',
        data: JSON.stringify(winners),
        id: 0,
    })
}
export const updateWinnersForAll = (
    wss: WebSocketServer,
    winners: Winner[]
) => {
    wss.clients.forEach((client) => {
        const response = createUpdateWinnersResponse(winners)
        if (client.readyState === client.OPEN) {
            client.send(response)
        }
    })
}
