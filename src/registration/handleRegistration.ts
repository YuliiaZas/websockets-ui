import type { WebSocket } from 'ws';

import { createPlayer, players, savePlayer } from '../database/players';
import { updateWinners } from '../database/winners';
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

export function handleRegistration(
  ws: WebSocket,
  message: Message,
  onSuccess?: () => void
): void {
  if (message.type !== MessageTypeEnum.REG) return;
  try {
    const data =
      typeof message.data === 'string'
        ? JSON.parse(message.data)
        : message.data;

    const registrationResponse = getRegistrationData(data);

    sendMessage<RegistrationResponse>(message.type, registrationResponse, ws);

    if (!registrationResponse.error && onSuccess) {
      onSuccess();
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
  const existingPlayer = players.get(name);

  if (existingPlayer) {
    if (existingPlayer.password !== password) {
      return { player: null, error: 'Invalid username or password' };
    }
    return { player: existingPlayer, error: null };
  }

  const newPlayer = createPlayer(name, password);
  savePlayer(newPlayer);
  updateWinners(newPlayer);

  return { player: newPlayer, error: null };
}
