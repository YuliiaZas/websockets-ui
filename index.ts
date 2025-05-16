import './src/ws_server/index';

import { httpServer } from './src/http_server/index';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
const server = httpServer.listen(HTTP_PORT);

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('close', () => {
  console.log('Server closed');
});

server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
