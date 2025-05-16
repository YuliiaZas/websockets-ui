import { Message } from '../models/message.type';

export function getDataFromMessage(message: Message): unknown {
  if (!message || typeof message !== 'object' || !('data' in message)) {
    throw new Error('Invalid message format: data property is missing');
  }

  return typeof message.data === 'string'
    ? JSON.parse(message.data)
    : message.data;
}
