export type MessageType =
    | 'reg'
    | 'create_game'
    | 'start_game'
    | 'turn'
    | 'attack'
    | 'finish'
    | 'update_room'
    | 'update_winners'

export interface Message {
    type: MessageType
    data: string
    id: 0
}

export interface Player {
    name: string
    password: string
    index: number | string
}
