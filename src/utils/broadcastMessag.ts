import { Message, MessageTypeEnum } from '../models/message.type.js';
import { sendMessage } from './sendMessage.js';

export function broadcastMessage<T>(
  type: MessageTypeEnum,
  data: Message<T>['data'],
  targetPlayerIds?: string[]
): void {
  sendMessage(type, data, null, targetPlayerIds);
}
