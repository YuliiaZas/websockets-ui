import {ShipInfoType} from "../types/CommonTypes";

export class GameModel {
    idGame: number | string
    players: Array<{ index: number | string,  playerId: number | string, ships: Array<ShipInfoType>, shipsStatus: Array<unknown>  }> = []

    constructor(obj: Partial<GameModel>) {
        Object.assign(this, obj)
    }

}
