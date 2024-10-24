import ws from 'ws'
export type MessageType =
    | 'reg'
    | 'create_room'
    | 'start_game'
    | 'turn'
    | 'attack'
    | 'finish'
    | 'add_user_to_room'
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
    ws: ws | null
    hasOwnRoom: boolean
}
