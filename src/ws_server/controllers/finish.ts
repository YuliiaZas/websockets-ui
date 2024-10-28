import {GamesDb} from "../db/games.db";
import {getClientConnection} from "../utils/getClientConnection";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {updateWinners} from "./updateWinners";
import {WinnersDb} from "../db/winners.db";
import {UsersDb} from "../db/users.db";
import {RoomsDb} from "../db/rooms.db";
import {BOT_INDEX} from "../constants";

const gamesDb = GamesDb.getInstance()
const winnersDb = WinnersDb.getInstance()
const usersDb = UsersDb.getInstance()
const rooms = RoomsDb.getInstance()

export const finish = (winPlayer: number | string, gameId: number | string) => {

    const currentGame = gamesDb.getGameByPlayerId(winPlayer)
    const [playerOne, playerTwo] = currentGame.players

    const playerOneIsNotABot = playerOne!.index != BOT_INDEX
    const playerTwoIsNotABot = playerTwo!.index != BOT_INDEX

    const playerOneConnection = playerOneIsNotABot ? getClientConnection({ playerIndex:playerOne!.playerId  }) : ''
    const playerTwoConnection = playerTwoIsNotABot ? getClientConnection({ playerIndex:playerTwo!.playerId  }) : ''

    const message = prepareJsonResponse(
        MessageTypeEnum.Finish,
        JSON.stringify({
            winPlayer
        })
    )

    // Add winner to winners
    const winnerClientIndex = winPlayer === playerOne!.playerId ? playerOne!.index : playerTwo!.index
    const winnerName = usersDb.getUser(winnerClientIndex).name

    if (winnerClientIndex != BOT_INDEX) {
        winnersDb.addWinner(winnerName)
    }

    // Delete game
    gamesDb.deleteGame(gameId)

    // delete room
    rooms.deleteRoom(playerOne!.index, playerTwo!.index)

    playerOneConnection && playerOneConnection.send(message)
    playerTwoConnection && playerTwoConnection.send(message)

    updateWinners()
}
