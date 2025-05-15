import { randomUUID } from 'crypto';
import type { WebSocket } from 'ws';

import { players } from '../database/players';
import { Message, MessageTypeEnum } from '../entities/message.type';
import { RegistrationResponse } from '../entities/registration.type';
import { Player } from '../models/player';
import { sendMessage } from '../utils/sendMessage';
import { isRegistrationRequest } from '../utils/validation';

const registrationData: RegistrationResponse = {
  name: '',
  index: '',
  error: true,
  errorText: '',
};

export function handleRegistration(ws: WebSocket, message: Message) {
  if (message.type !== MessageTypeEnum.REG) return;
  try {
    const data =
      typeof message.data === 'string'
        ? JSON.parse(message.data)
        : message.data;
    sendMessage(ws, message.type, getRegistrationData(data));
  } catch (error) {
    sendMessage(ws, message.type, {
      ...registrationData,
      errorText: 'Server error: ' + error,
    });
  }
}

const getRegistrationData = (data: unknown): RegistrationResponse => {
  if (!isRegistrationRequest(data)) {
    return {
      ...registrationData,
      errorText: 'Invalid data format',
    };
  }

  const { name, password } = data;

  if (!name || !password) {
    return {
      ...registrationData,
      errorText: 'Name and password are required',
    };
  }

  const existingPlayer = players.get(name);

  if (existingPlayer && existingPlayer.password !== password) {
    return {
      ...registrationData,
      errorText: 'Invalid username or password',
    };
  }

  const player = existingPlayer ?? createPlayer(name, password);

  if (!existingPlayer) savePlayer(player);

  return {
    ...registrationData,
    error: false,
    name: player.name,
    index: player.index,
  };
};

const createPlayer = (name: string, password: string): Player => {
  return {
    name,
    password,
    wins: 0,
    index: randomUUID(),
  };
};

const savePlayer = (player: Player): void => {
  players.set(player.name, player);
  console.log('--Player saved:', player, 'players:', players);
};
