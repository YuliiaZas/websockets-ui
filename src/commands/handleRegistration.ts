import type { WebSocket } from 'ws';

import {
  createPlayer,
  getPlayer,
  getPlayerByName,
} from '../database/players.js';
import { Message, MessageTypeEnum } from '../models/message.type.js';
import { Player } from '../models/player.type.js';
import { RegistrationResponse } from '../models/requests/registration.type.js';
import { getDataFromMessage } from '../utils/getDataFromMessage.js';
import { sendMessage } from '../utils/sendMessage.js';
import { isRegistrationRequest } from '../utils/validation.js';

const registrationData: RegistrationResponse = {
  name: '',
  index: '',
  error: true,
  errorText: '',
};

export function handleRegistration(
  ws: WebSocket,
  message: Message,
  onSuccessCallback?: () => void
): void {
  if (message.type !== MessageTypeEnum.REG) return;
  try {
    const registrationResponse = getRegistrationData(
      getDataFromMessage(message)
    );

    sendMessage<RegistrationResponse>(message.type, registrationResponse, ws);

    if (!registrationResponse.error) {
      ws.player = getPlayer(registrationResponse.index);
    }

    if (!registrationResponse.error && onSuccessCallback) {
      onSuccessCallback();
    }
  } catch (error) {
    sendMessage<RegistrationResponse>(
      message.type,
      {
        ...registrationData,
        errorText:
          'Server error: ' +
          (error instanceof Error ? error.message : String(error)),
      },
      ws
    );
  }
}

function getRegistrationData(data: unknown): RegistrationResponse {
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

  const { player, error: errorText } = registerOrLoginPlayer(name, password);

  if (errorText || !player) {
    return {
      ...registrationData,
      errorText: errorText ?? 'Unknown error',
    };
  }

  return {
    ...registrationData,
    error: false,
    name: player.name,
    index: player.index,
  };
}

function registerOrLoginPlayer(
  name: string,
  password: string
): { player: Player | null; error: string | null } {
  const existingPlayer = getPlayerByName(name);

  if (existingPlayer) {
    if (existingPlayer.password !== password) {
      return { player: null, error: 'Invalid username or password' };
    }
    return { player: existingPlayer, error: null };
  }

  const newPlayer = createPlayer(name, password);

  return { player: newPlayer, error: null };
}
