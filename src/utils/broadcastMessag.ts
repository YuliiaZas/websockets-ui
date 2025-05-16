import { Message, MessageTypeEnum } from '../models/message.type';
import { sendMessage } from './sendMessage';

export function broadcastMessage<T>(
  type: MessageTypeEnum,
  data: Message<T>['data'],
  targetPlayerIds?: string[]
): void {
  sendMessage(type, data, null, targetPlayerIds);
}
