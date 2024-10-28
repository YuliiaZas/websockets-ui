import { WebSocketServer } from 'ws';
import { getPort } from "./src/helpers/env.js";
import { httpServer } from "./src/http_server/index.js";
import { WsClientMessageTypes } from './src/const/ws-message-types.js';

import { randomUUID } from 'crypto';
import { updateRoom } from './src/controllers/update-room.js';
import { createRoomAndAddPlayerToRoom } from './src/controllers/create-room-and-add-player.js';
import { regPlayer } from './src/controllers/reg-player.js';
import { addPlayerToRoom } from './src/controllers/add-player-to-room.js';
import { createGame } from './src/controllers/create-game.js';
import { updateWinners } from './src/controllers/update-winners.js';
import { addShips } from './src/controllers/add-ship.js';

const HTTP_PORT = getPort();

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

export const wss = new WebSocketServer({ server: httpServer });

const clients = new Map();

wss.on('connection', ws => {
  const clientId = randomUUID();
  ws.id = clientId;
  clients.set(clientId, ws);
  console.log(`A new client with id ${clientId} connected!`);

  ws.on('message', message =>  {
    const { type, data } = JSON.parse(message);
    console.log('type', type);

    switch (type) {
      case WsClientMessageTypes.reg:
        const { name } = JSON.parse(data);
        regPlayer(clientId, name, ws);
        updateRoom(wss);
        updateWinners(wss);
        break;

      case WsClientMessageTypes.create_room:
        createRoomAndAddPlayerToRoom(clientId, wss);
        break;
  
      case WsClientMessageTypes.add_user_to_room:
        const { indexRoom } = JSON.parse(data);
        addPlayerToRoom(clientId, indexRoom);
        updateRoom(wss);
        createGame(indexRoom, wss);
        break;

      case WsClientMessageTypes.add_ships:
        console.log("add_shipsData", data);
        const { gameId, indexPlayer, ships } = JSON.parse(data);
        addShips(gameId, indexPlayer, ships, clients)
        break;

      case WsClientMessageTypes.attack:
        console.log('attack');
        break;
      case WsClientMessageTypes.randomAttack:
        console.log('randomAttack');
        break;

      // default:

    }
  })

  ws.on('close', () => {
    console.log('Client has disconnected');
  });
});
