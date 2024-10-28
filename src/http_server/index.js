import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';

const __dirname = path.resolve(path.dirname(''));

const rooms = new Map();
const players = new Map();
let roomIdCounter = 1;

export const httpServer = http.createServer(function (req, res) {
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

const wss = new WebSocketServer({ server: httpServer });
console.log(`WebSocket server running on ws://localhost:${process.env.PORT}`);

function generateUniqueID() {
    return Math.random().toString(36).substr(2, 9);
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log("Получено сообщение от клиента:", messageString);

        try {
            const request = JSON.parse(messageString);
            handleRequest(ws, request);
        } catch (error) {
            console.error("Ошибка:", error.message);
            ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        console.log("Player disconnected");
    });
});

function handleRequest(ws, request) {
    request.data = request.data ? JSON.parse(request.data) : request.data;

    let player;

    switch (request.type) {
        case 'reg':
            registerPlayer(ws, request.data);
            break;
        case 'create_room':
            const id = generateUniqueID();
            player = { ws, name: `Player_${id}`, index: id };
            players.set(ws, player);
            createRoom(ws, player);
            updateRooms();
            break;
        case "add_user_to_room":
            player = players.get(ws);
            addUserToRoom(ws, player, request.data.indexRoom);
            updateRooms();
            break;
        default:
            ws.send(JSON.stringify({ error: 'Unknown request type' }));
    }
}

function registerPlayer(ws, { name, password }) {
    if (!name || !password) {
        ws.send(JSON.stringify({ type: 'reg', data: JSON.stringify({ error: true, errorText: 'Name and password are required' }), id: 0 }));
        return;
    }

    if (players[name]) {
        if (players[name].password !== password) {
            ws.send(JSON.stringify({ type: 'reg', data: JSON.stringify({ error: true, errorText: 'Incorrect password' }), id: 0 }));
        } else {
            ws.send(JSON.stringify({ type: 'reg', data: JSON.stringify({ name, index: name, error: false, errorText: '' }), id: 0 }));
        }
    } else {
        players[name] = { password, wins: 0 };
        ws.send(JSON.stringify({ type: 'reg', data: JSON.stringify({ name, index: name, error: false, errorText: '' }), id: 0 }));
    }
}

function createRoom(ws, player) {
    const roomId = roomIdCounter++;
    rooms.set(roomId, [player]);
    ws.send(JSON.stringify({
        type: "update_room",
        data: JSON.stringify(Array.from(rooms).map(([roomId, users]) => ({
            roomId,
            roomUsers: users.map(user => ({
                name: user.name,
                index: user.index
            }))
        }))),
        id: 0
    }));
}

function addUserToRoom(ws, player, indexRoom) {
    const room = rooms.get(indexRoom);
    if (room && room.length === 1) {
        room.push(player);

        rooms.delete(indexRoom);

        const idGame = generateUniqueID();
        const idPlayer1 = generateUniqueID();
        const idPlayer2 = generateUniqueID();

        room.forEach((user, index) => {
            user.ws.send(JSON.stringify({
                type: "create_game",
                data: JSON.stringify({
                    idGame,
                    idPlayer: index === 0 ? idPlayer1 : idPlayer2
                }),
                id: 0
            }));
        });
    } else {
        ws.send(JSON.stringify({ error: "Комната недоступна для присоединения" }));
    }
}

function updateRooms() {
    const availableRooms = Array.from(rooms)
        .filter(([_, users]) => users.length === 1)
        .map(([roomId, users]) => ({
            roomId,
            roomUsers: users.map(user => ({
                name: user.name,
                index: user.index
            }))
        }));

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "update_room",
                data: JSON.stringify(availableRooms),
                id: 0
            }));
        }
    });
}

process.on('SIGINT', () => {
    console.log("Завершение работы сервера...");
    wss.clients.forEach(client => client.close());
    httpServer.close(() => {
        console.log("Сервер корректно завершил работу.");
        process.exit(0);
    });
});

// I'll continue...