import { WebSocketServer } from "ws";
import { players, rooms } from '../db.ts'

const handleRequest = (ws: WebSocket, request: any, server: WebSocketServer) => {
    console.log('handle');
    switch(request.type) {
        case 'register': 
            handleRegistration(ws, request);
            break;
        case 'create_game':
            handleCreateGame(ws, request);
            break;
        case 'join_game':
            handleJoinGame(ws, request);
            break;
        case 'start_game':
            handleStartGame(ws, request);
            break;
        case 'next_turn':
            handleTurn(ws, request);
            break;
        case 'do_ attack':
            handleAttack(ws, request);
            break;
        case 'finish':
            handleFinish(ws, request);
            break;
        default: 
            console.log('Wrong reequest');
    }
}

function handleRegistration(ws: WebSocket, request: any) {
    // Register or authenticate the player, add to players DB
}

function handleCreateGame(ws: WebSocket, request: any) {
    // Create game room, respond with game ID
}

function handleJoinGame(ws: WebSocket, request: any) {
    // Add player to existing game room
}

function handleStartGame(ws: WebSocket, request: any) {
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

export {handleRequest};