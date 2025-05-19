import { httpServer } from './src/http_server/index.js';
import { wss } from './src/ws_server/index.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
const server = httpServer.listen(HTTP_PORT);

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('close', () => {
  console.log('HTTP Server closed');
});

server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutdown();
});

let isShuttingDown = false;

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('\nShutting down...');

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.close(1001, 'Server shutting down');
    }
  });

  let wsClosed = false;
  let httpClosed = false;

  function tryExit() {
    if (wsClosed && httpClosed) {
      console.log('Shutdown complete');
      process.exit(0);
    }
  }

  wss.close(() => {
    console.log('WebSocket server closed');
    wsClosed = true;
    tryExit();
  });

  server.close(() => {
    httpClosed = true;
    tryExit();
  });

  setTimeout(() => {
    console.warn('Forced shutdown after timeout');
    process.exit(1);
  }, 5000).unref();
}
