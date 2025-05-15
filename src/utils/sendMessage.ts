import { WebSocket } from 'ws';

export function sendMessage(ws: WebSocket, type: string, data: unknown): void {
  try {
    const payload = JSON.stringify({
      type,
      data: JSON.stringify(data),
      id: 0,
    });
    ws.send(payload);
    console.log(`Command '${type}' sent successfully with data:`, data);
  } catch (err) {
    console.error(
      `Failed to send message for command '${type}' with data`,
      data,
      '\nError:',
      err
    );
  }
}
