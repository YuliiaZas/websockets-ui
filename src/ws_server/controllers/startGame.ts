import {ConnectionsDb} from "../db/connections.db";
import {GamesDb} from "../db/games.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";

const connectionDb = ConnectionsDb.getInstance()
const games = GamesDb.getInstance()

export const startGame = (idGame: number | string) => {
    const game = games.getGame(idGame)

    const [playerOne, playerTwo] = game.players

    const playerOneConnection = connectionDb.getConnection(playerOne!.index as string)
    const playerTwoConnection = connectionDb.getConnection(playerTwo!.index as string)

    const messageOne = prepareJsonResponse(
        MessageTypeEnum.StartGame,
       JSON.stringify( {
            ships: playerOne!.ships,
            currentPlayerIndex: playerOneConnection
        })
        )


    const messageTwo = prepareJsonResponse(
        MessageTypeEnum.StartGame,
        JSON.stringify( {
            ships: playerTwo!.ships,
            currentPlayerIndex: playerTwoConnection
        })
    )

    playerOneConnection.send(messageOne)
    playerTwoConnection.send(messageTwo)
}
