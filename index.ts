import { WebSocket, WebSocketServer } from 'ws';
import { getPort } from "./src/helpers/env.ts";
import { httpServer } from "./src/http_server/index.ts";
import { WsClientMessageTypes } from './src/const/ws-message-types.ts';
import { updateRoom } from './src/controllers/update-room.ts';
import { createRoomAndAddPlayerToRoom } from './src/controllers/create-room-and-add-player.ts';
import { regPlayer } from './src/controllers/reg-player.ts';
import { addPlayerToRoom } from './src/controllers/add-player-to-room.ts';
import { createGame } from './src/controllers/create-game.ts';
import { updateWinners } from './src/controllers/update-winners.ts';
import { addShips } from './src/controllers/add-ship.ts';
import { doAttack } from './src/controllers/do-attack.ts';
import { doRandomAttack } from './src/controllers/do-random-attack.ts';
import { WebSocketClients } from './src/types/ws-clients.ts';
import { setWsClient } from './src/helpers/set.ts';

const HTTP_PORT = getPort();

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

export const wss = new WebSocketServer({ server: httpServer });

const wsClients: WebSocketClients = new Map();

wss.on('connection', (ws: WebSocket) => {
  const clientId = setWsClient(wsClients, ws);
  console.log(`A new client with id ${clientId} connected!`);

  ws.on('message', (message: string) =>  {
    const { type, data } = JSON.parse(message);
    console.log('type', type);

    switch (type) {
      case WsClientMessageTypes.reg:
        const { name } = JSON.parse(data);
        regPlayer(clientId, name, ws);
        updateRoom(wsClients);
        updateWinners(wsClients);
        break;

      case WsClientMessageTypes.create_room:
        createRoomAndAddPlayerToRoom(clientId, wsClients);
        break;
  
      case WsClientMessageTypes.add_user_to_room:
        const { indexRoom } = JSON.parse(data);
        addPlayerToRoom(clientId, indexRoom);
        updateRoom(wsClients);
        createGame(indexRoom, wsClients);
        break;

      case WsClientMessageTypes.add_ships:
        const { gameId, indexPlayer, ships } = JSON.parse(data);
        addShips(gameId, indexPlayer, ships, wsClients)
        break;

      case WsClientMessageTypes.attack:
        doAttack(data, wsClients);
        break;

      case WsClientMessageTypes.randomAttack:
        doRandomAttack(data, wsClients);
        break;

      // default:

    }
  })

  ws.on('close', () => {
    console.log('Client has disconnected');
  });
});
