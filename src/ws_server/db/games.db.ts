import {GameModel} from "../models/GameModel";
import {ShipInfoType} from "../types/CommonTypes";

export class GamesDb {
    public static instance: GamesDb;

    public static getInstance() {
        if (!GamesDb.instance) {
            GamesDb.instance = new GamesDb();
        }
        return GamesDb.instance;
    }

    private games: GameModel[] = []

    getGames() {
        return this.games
    }

    getGame(idGame: string | number):GameModel  {
        return this.games.find(game => game.idGame === idGame)!
    }

    /**
     *  Create new game
     */
    createGame(clientOneIndex: string | number, clientTwoIndex: string | number): GameModel {
        const idGame = new Date().getTime().toString()
        const playerOne = {
            playerId: new Date().getTime().toString(),
            ships: [],
            shipsStatus: [],
            index: clientOneIndex
        }
        const playerTwo = {
            playerId: new Date().getTime().toString(),
            ships: [],
            shipsStatus: [],
            index: clientTwoIndex
        }

        const newGame: GameModel = {
            idGame,
            players: [playerOne, playerTwo]
        }

        this.games.push(newGame)

        return newGame
    }

    addShips(idGame: string | number  , ships: ShipInfoType[], playerId: string | number) {
        this.games = this.games.map(game => {
            if (game.idGame == idGame) {
                return {
                    ...game,
                    players: game.players.map(player => {

                        if (player.playerId === playerId) {
                            return {
                                ...player,
                                ships: ships
                            };
                        }
                        return player;
                    })
                };
            }
            return game;
        });
    }
}
