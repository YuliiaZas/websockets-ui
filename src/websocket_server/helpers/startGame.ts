import { addShipsData, Ship } from '../handlers/handleAddShips'
import ws from 'ws'
export const startGame = (game: addShipsData[]) => {
    game.forEach((data) => {
        const { ships, gameId, indexPlayer } = data
        const currentSoket = data.ws
        currentSoket.send(createStartGameResponse(gameId, ships, indexPlayer))
    })
}

const createStartGameResponse = (
    gameId: string,
    ships: Ship[],
    indexPlayer: string
) => {
    return JSON.stringify({
        type: 'start_game',
        data: JSON.stringify({
            gameId,
            ships,
            indexPlayer,
        }),
        id: 0,
    })
}
