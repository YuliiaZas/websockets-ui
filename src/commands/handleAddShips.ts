import { addShips } from '../database/games.js';
import { Game } from '../models/game.type.js';
import { Message, MessageTypeEnum } from '../models/message.type.js';
import { getDataFromMessage } from '../utils/getDataFromMessage.js';
import { isAddShipsRequest } from '../utils/validation.js';

export function handleAddShips(
  message: Message,
  onSuccessCallback?: (game: Game) => void
): void {
  if (message.type !== MessageTypeEnum.ADD_SHIPS) return;

  try {
    const data = getDataFromMessage(message);
    if (!isAddShipsRequest(data)) {
      throw new Error('Invalid message data for adding ships: ' + String(data));
    }

    const gameWithAddedShips = addShips(
      data.gameId,
      data.indexPlayer,
      data.ships
    );

    if (gameWithAddedShips && onSuccessCallback) {
      onSuccessCallback(gameWithAddedShips);
    }
  } catch (error) {
    console.error('Error handling ships adding to game:', error);
  }
}
