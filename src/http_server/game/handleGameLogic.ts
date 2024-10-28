import { WebSocketServer } from "ws";
import { players, rooms, games, wsToPlayer } from '../db.ts'
import { uid4 as uid } from 'uuid';



const handleRequest = (ws: WebSocket, request: any, server: WebSocketServer) => {
    console.log('handle');
    switch (request.type) {
        case 'reg':
            handleRegistration(ws, request, server);
            break;
        case 'create_room':
            handleCreateRoom(ws, request, server);
            break;
        case 'add_user_to_room':
            handleJoinRoom(ws, request, server);
            break;
        case 'add_ships':
            handleAddShips(ws, request);
            break;
        case 'attack':
            handleAttack(ws, request);
            break;
        case 'random_attack':
            handleAttack(ws, request);
            break;
        case 'finish':
            handleFinish(ws, request);
            break;
        default:
            console.log('Wrong reequest');
    }
}

function handleRegistration(ws: WebSocket, request: any, server: WebSocketServer) {
    const { name, password } = request.data;
    if (players.has(name)) {
        const player = players.get(name);
        if (player && player.password === password) {
            // Send successful login response
            ws.send(JSON.stringify({
                type: 'reg',
                data: { name, index: player.id, error: false, errorText: '' },
                id: 0
            }));
        } else {
            // Invalid credentials
            ws.send(JSON.stringify({
                type: 'reg',
                data: { name, index: '', error: true, errorText: 'Invalid credentials' },
                id: 0
            }));
            return;
        }
    } else {
        // Register new player
        const id = uid();
        players.set(name, { id, username: name, password, wins: 0 });
        wsToPlayer.set(ws, id);
        ws.send(JSON.stringify({
            type: 'reg',
            data: { name, index: id, error: false, errorText: '' },
            id: 0
        }));
    }
    // Send updated room list to all players
    const updateRoomData = Array.from(rooms.values())
        .filter(room => room.players.length === 1)
        .map(room => ({
            roomId: room.id,
            roomUsers: room.players.map(p => ({ name: p.username, index: p.id }))
        }));

    ws.send(JSON.stringify({
        type: 'update_room',
        data: updateRoomData,
        id: 0
    }));

    // Send updated winners leaderboard to all players
    const updateWinnersData = Array.from(players.values())
        .map(player => ({ name: player.username, wins: player.wins }))
        .sort((a, b) => b.wins - a.wins);

    ws.send(JSON.stringify({
        type: 'update_winners',
        data: updateWinnersData,
        id: 0
    }));
}



function handleCreateRoom(ws: WebSocket, request: any, server: WebSocketServer) {
    const playerId = wsToPlayer.get(ws);

    if (!playerId) {
        console.error(`Player ID not found.`);
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'PlayerID not found.' },
            id: 0
        }));
        return;
    }

    const roomId = uid();
    const player = players.get(playerId);

    if (!player) {
        console.error(`Player with ID ${playerId} not found.`);
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Player not found.' },
            id: 0
        }));
        return;
    }
    
    rooms.set(roomId, { id: roomId, players: [player], gameId: null });

    const updateRoomData = Array.from(rooms.values())
        .filter(room => room.players.length ===1)
        .map(room => ({
            roomId: room.id,
            roomUsers:room.players.map(p => ({name: p.username, index: p.id}))
        }))

    server.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'update_room',
                data: updateRoomData,
                id: 0
            }))
        }
    })
}

function handleJoinRoom(ws: WebSocket, request: any, server: WebSocketServer) {
    const roomId = request.data.indexRoom;
    const room = rooms.get(roomId);

    if (!room) {
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Room not found.' },
            id: 0
        }));
        return;
    }

    const playerId = wsToPlayer.get(ws);

    if (!playerId) {
        console.error(`Player ID not found.`);
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'PlayerID not found.' },
            id: 0
        }));
        return;
    }

    const player = players.get(playerId);
    if (!player) {
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Player not found.' },
            id: 0
        }));
        return;
    }


    if (room.players.length >= 2) {
        ws.send(JSON.stringify({
            type: 'error',
            data: { message: 'Room is full.' },
            id: 0
        }));
        return;
    }

    room.players.push(player);
    const gameId = uid();
    room.gameId = gameId;
    games.set(gameId, { id: gameId, players: {[room.players[0].id]:{ ships: [], shots:[]}, playerId:{ ships: [], shots:[]}}, currentPlayer: playerId });
    room.players.forEach((roomPlayer) => {
        const response = JSON.stringify({
            type: 'create_game',
            data: {
                idGame: gameId,
                idPlayer: roomPlayer.id
            },
            id: 0
        });

        const playerSocket = Array.from(wsToPlayer.entries()).find(([socket, id]) => id === roomPlayer.id)?.[0];
        if (playerSocket && playerSocket.readyState === WebSocket.OPEN) {
            playerSocket.send(response);
        }
    });
    rooms.delete(roomId);

    ws.send(JSON.stringify({
        type: 'update_room',
        data: [
            {
                roomId: roomId,
                roomUsers: room.players.map((player) => ({
                    name: player.username,
                    index: player.id
                }))
            }
        ],
        id: 0
    }));
}

function handleAddShips(ws: WebSocket, request: any) {
    // Initialize the game state and notify both players
}

function handleTurn(ws: WebSocket, request: any) {
    // Manage turns, ensure only current player can make a move
}

function handleAttack(ws: WebSocket, request: any) {
    // Process attack, send hit/miss result, update game state
}

function handleFinish(ws: WebSocket, request: any) {
    // Declare winner, update score, notify players
}

export { handleRequest };