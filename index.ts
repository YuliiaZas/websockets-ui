import { httpServer } from './src/http_server/index';
import { wss } from './src/ws_server/index';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
const server = httpServer.listen(HTTP_PORT);
server.on('upgrade', (req, socket, head) => {
  console.log('Upgrade request received');
  // Handle the upgrade request here
  // For example, you can pass it to your WebSocket server
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});
server.on('error', (err) => {
  console.error('Server error:', err);
});
server.on('listening', () => {
  console.log(`Server is listening on port ${HTTP_PORT}`);
});
server.on('close', () => {
  console.log('Server closed');
});
server.on('clientError', (err, socket) => {
  console.error('Client error:', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.on('request', (req, res) => {
  console.log('Request received:', req.method, req.url);
});
server.on('connection', (socket) => {
  console.log('New connection established');
  socket.on('close', () => {
    console.log('Connection closed');
  });
});
server.on('checkContinue', (req, res) => {
  console.log('Check-Continue request received');
  res.writeContinue();
  res.end();
});
