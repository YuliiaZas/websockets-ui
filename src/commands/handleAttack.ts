import type { WebSocket } from 'ws';

import {
  changeCurrentPlayer,
  changeGameStatus,
  getGame,
} from '../database/games.js';
import { updateWinsForPlayer } from '../database/winners.js';
import { Game, GameStatus } from '../models/game.type.js';
import { Message, MessageTypeEnum } from '../models/message.type.js';
import {
  AttackResponse,
  AttackStatus,
} from '../models/requests/attack.type.js';
import { broadcastMessage } from '../utils/broadcastMessag.js';
import {
  getRandomAttackCoordinates,
  processAttack,
} from '../utils/gameUtils.js';
import { getDataFromMessage } from '../utils/getDataFromMessage.js';
import { isAttackRequest, isRandomAttackRequest } from '../utils/validation.js';

export function handleAttack(
  ws: WebSocket,
  message: Message,
  onSuccessCallback?: (game: Game) => void
) {
  if (message.type !== MessageTypeEnum.ATTACK) return;
  try {
    const attackData = getDataFromMessage(message);
    if (!isAttackRequest(attackData)) {
      throw new Error('Invalid data format');
    }

    if (!ws.player) {
      throw new Error('Player not registered');
    }
    if (ws.player.index !== attackData.indexPlayer) {
      throw new Error('Player index mismatch');
    }

    const game = getGame(attackData.gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    if (game.gameStatus !== 'started') {
      throw new Error('Game is not started');
    }
    if (game.currentPlayerIndex !== attackData.indexPlayer) {
      throw new Error('Wrong user turn');
    }

    const attackResult = processAttack(game, attackData.x, attackData.y);
    if (!attackResult) {
      throw new Error('User ships not found');
    }

    let updatedGame = game;

    if (attackResult.status === AttackStatus.KILLED) {
      attackResult.cellsArround?.forEach(([x, y]) => {
        broadcastMessage<AttackResponse>(
          MessageTypeEnum.ATTACK,
          {
            position: { x, y },
            currentPlayer: attackData.indexPlayer,
            status: AttackStatus.MISS,
          },
          game.players
        );
      });
      attackResult.allShipCells?.forEach(([x, y]) => {
        broadcastMessage<AttackResponse>(
          MessageTypeEnum.ATTACK,
          {
            position: { x, y },
            currentPlayer: attackData.indexPlayer,
            status: AttackStatus.KILLED,
          },
          game.players
        );
      });

      if (attackResult.isAllSunk) {
        updatedGame = changeGameStatus(game, GameStatus.FINISHED);
        updateWinsForPlayer(ws.player.index);
      }
    } else {
      broadcastMessage<AttackResponse>(
        MessageTypeEnum.ATTACK,
        {
          position: {
            x: attackData.x,
            y: attackData.y,
          },
          currentPlayer: attackData.indexPlayer,
          status: attackResult.status,
        },
        game.players
      );

      if (attackResult.status === AttackStatus.MISS) {
        updatedGame = changeCurrentPlayer(game);
      }
    }

    if (onSuccessCallback) {
      onSuccessCallback(updatedGame);
    }
  } catch (error) {
    console.error('Error handling attack:', error);
  }
}

export function handleRandomAttack(
  ws: WebSocket,
  message: Message,
  onSuccessCallback?: (game: Game) => void
) {
  if (message.type !== MessageTypeEnum.RANDOM_ATTACK) return;
  try {
    const attackData = getDataFromMessage(message);
    if (!isRandomAttackRequest(attackData)) {
      throw new Error('Invalid data format');
    }
    const randomCoordinates = getRandomAttackCoordinates(
      getGame(attackData.gameId)!
    );
    const attackMessage = {
      ...message,
      type: MessageTypeEnum.ATTACK,
      data: JSON.stringify({
        ...attackData,
        ...randomCoordinates,
      }),
    };

    handleAttack(ws, attackMessage, (game: Game) => {
      onSuccessCallback && onSuccessCallback(game);
    });
  } catch (error) {
    console.error('Error handling random attack:', error);
  }
}
