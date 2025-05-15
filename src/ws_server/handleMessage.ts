import type { WebSocket } from 'ws';

import { getWinners } from '../database/winners';
import { handleRegistration } from '../registration/handleRegistration';
import { broadcastMessage } from '../utils/broadcastMessag';
import { Message, MessageTypeEnum } from './../entities/message.type';
import { WinnersResponse } from '../entities/winners.type';

export function handleMessage(ws: WebSocket, message: Message) {
  switch (message.type) {
    case MessageTypeEnum.REG:
      handleRegistration(ws, message, broadcastWinners);
      break;
    case MessageTypeEnum.UPDATE_WINNERS:
      ws.send(
        JSON.stringify({
          type: 'update_winners',
          data: { winners: message.data },
        })
      );
      break;
    case MessageTypeEnum.CREATE_ROOM:
      ws.send(
        JSON.stringify({ type: 'create_room', data: { roomId: message.data } })
      );
      break;
    case MessageTypeEnum.ADD_USER_TO_ROOM:
      ws.send(
        JSON.stringify({
          type: 'add_user_to_room',
          data: { roomId: message.data },
        })
      );
      break;
    case MessageTypeEnum.CREATE_GAME:
      ws.send(
        JSON.stringify({ type: 'create_game', data: { gameId: message.data } })
      );
      break;
    case MessageTypeEnum.UPDATE_ROOM:
      ws.send(
        JSON.stringify({ type: 'update_room', data: { roomId: message.data } })
      );
      break;
    case MessageTypeEnum.ADD_SHIPS:
      ws.send(
        JSON.stringify({ type: 'add_ships', data: { ships: message.data } })
      );
      break;
    case MessageTypeEnum.START_GAME:
      ws.send(
        JSON.stringify({ type: 'start_game', data: { gameId: message.data } })
      );
      break;
    case MessageTypeEnum.ATTACK:
      ws.send(
        JSON.stringify({ type: 'attack', data: { attackData: message.data } })
      );
      break;
    case MessageTypeEnum.RANDOM_ATTACK:
      ws.send(
        JSON.stringify({
          type: 'randomAttack',
          data: { attackData: message.data },
        })
      );
      break;
    case MessageTypeEnum.TURN:
      ws.send(
        JSON.stringify({ type: 'turn', data: { turnData: message.data } })
      );
      break;
    case MessageTypeEnum.FINISH:
      ws.send(
        JSON.stringify({ type: 'finish', data: { finishData: message.data } })
      );
      break;
  }
}

const broadcastWinners = () =>
  broadcastMessage<WinnersResponse[]>(MessageTypeEnum.UPDATE_WINNERS, getWinners());
