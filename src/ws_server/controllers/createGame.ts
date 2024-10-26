import {ConnectionsDb} from "../db/connections.db";
import {RoomsDb} from "../db/rooms.db";
import {prepareJsonResponse} from "../utils/prepareJsonResponse";
import {MessageTypeEnum} from "../enums/MessageTypeEnum";
import {GamesDb} from "../db/games.db";

const connectionsDb = ConnectionsDb.getInstance()
const roomsDb = RoomsDb.getInstance()
const gamesDb = GamesDb.getInstance()

export const createGame = (indexRoom: string | number) => {
    const { roomUsers } = roomsDb.getRoom(indexRoom)
    const [playerOne, playerTwo] =  roomUsers

    const userOneConnection = connectionsDb.getConnection(playerOne!.index)
    const userTwoConnection = connectionsDb.getConnection(playerTwo!.index)

    const newGameData = gamesDb.createGame(playerOne!.index, playerTwo!.index)

    const idForGame = newGameData.idGame
    const idForPlayerOne = newGameData.players[0]!.playerId
    const idForPlayerTwo = newGameData.players[1]!.playerId

    const responseOne = prepareJsonResponse(MessageTypeEnum.CreateGame, JSON.stringify({idGame: idForGame, idPlayer: idForPlayerOne}))
    const responseTwo = prepareJsonResponse(MessageTypeEnum.CreateGame, JSON.stringify({idGame: idForGame, idPlayer: idForPlayerTwo}))

    userOneConnection.send(responseOne)
    userTwoConnection.send(responseTwo)
}
