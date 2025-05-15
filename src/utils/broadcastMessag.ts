import { Message } from '../entities/message.type';
import { sendMessage } from './sendMessage';

export function broadcastMessage<T>(type: string, data: Message<T>['data']) {
  sendMessage(type, data, null);
}
