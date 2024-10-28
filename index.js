import { httpServer } from "./src/http_server/index.js";
// import { updateRoom } from './src/update_room.js';
import { updateWinners } from "./src/http_server/handler/update_winners.js";
import { handleRegistration } from './src/http_server/handler/reg.js';
import { handleCreateRoom } from './src/http_server/handler/create_room.js';
import { handleAddUserToRoom } from './src/http_server/handler/add_user_to_room.js';
import { handleAddShips } from './src/http_server/handler/add_ships.js';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;
const WS_PORT = 3000;



 console.log(`Start static http server on the ${HTTP_PORT} port!`);
 httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });
console.log(`WebSocket server running on port ${WS_PORT}`);




export const players = [];
export const rooms = [];
export const games = {};


wss.on('error', function(error) {
  console.error('Error', error)
})

wss.on('connection', ws => {
  console.log('New client connected');
  
  ws.on('message', message => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    switch (data.type) {
      case 'reg':
        handleRegistration(ws, data.data, players, rooms);
        console.log(players)
        break;
      case 'update_winners':
        updateWinners(ws);
        break


      case 'create_room':
        handleCreateRoom(ws, rooms, players, data);
        break;
      case 'add_user_to_room':
        handleAddUserToRoom(ws, data, rooms);
        break;
      case 'add_ships':
        handleAddShips(ws, data.data);
        break;
      case 'attack':
        handleAttack(ws, data.data);
        break;
      case 'randomAttack':
        handleRandomAttack(ws, data.data);
        break;
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown command' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});





