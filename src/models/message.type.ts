export enum MessageTypeEnum {
  REG = 'reg',
  UPDATE_WINNERS = 'update_winners',
  CREATE_ROOM = 'create_room',
  ADD_USER_TO_ROOM = 'add_user_to_room',
  CREATE_GAME = 'create_game',
  UPDATE_ROOM = 'update_room',
  ADD_SHIPS = 'add_ships',
  START_GAME = 'start_game',
  ATTACK = 'attack',
  RANDOM_ATTACK = 'randomAttack',
  TURN = 'turn',
  FINISH = 'finish',
}

type MessageTypes = (typeof MessageTypeEnum)[keyof typeof MessageTypeEnum];

export type Message<T = unknown> = {
  type: MessageTypes;
  data: T;
  id: 0;
};
