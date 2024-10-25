import ws from 'ws'
import { startGame } from '../helpers/startGame'
export const handleAddShips = (
    data: string,
    games: Map<string, addShipsData[]>,
    ws: ws
) => {
    const gameData = JSON.parse(data) as addShipsData
    gameData.ws = ws
    if (games.has(gameData.gameId)) {
        games.set(gameData.gameId, [...games.get(gameData.gameId)!, gameData])
    } else {
        games.set(gameData.gameId, [gameData])
    }
    const game = games.get(gameData.gameId) as addShipsData[]
    if (game?.length === 2) {
        startGame(game)
        games.delete(gameData.gameId)
    }
}

export interface addShipsData {
    ws: ws
    gameId: string
    ships: Ship[]
    indexPlayer: string
}

export interface Ship {
    position: {
        x: number
        y: number
    }
    direction: boolean
    length: number
    type: string
}
