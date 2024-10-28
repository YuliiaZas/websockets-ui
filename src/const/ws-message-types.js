export const WsClientMessageTypes = {
  reg: 'reg',
  create_room: 'create_room',
  add_user_to_room: 'add_user_to_room',
  add_ships: 'add_ships',
  attack: 'attack',
  randomAttack: 'randomAttack'
}

export const WsServerMessageTypes = {
  reg: 'reg',
  create_game: 'create_game',
  start_game: 'start_game',
  update_room: 'update_room',
  update_winners: 'update_winners',
  turn: 'turn',
  attack: 'attack',
  finish: 'finish'
}
