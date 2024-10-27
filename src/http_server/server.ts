import { WebSocketServer, WebSocket } from "ws";
import dotenv from 'dotenv';
import { handleRequest } from './game/handleGameLogic';

dotenv.config();
const PORT = process.env.PORT || 8081;

const server = new WebSocketServer({port: Number(PORT)})

server.on('connection', (ws:WebSocket) => {
    console.log("User connected");

    ws.on('message', (message: string) => {
        const request = JSON.parse(message);
        handleRequest(ws, request, server);
    });

    ws.on('close', () => {
        console.log("Bue player. (DISCONNECTED)");
    })
})

console.log(`Server is running on port: ${PORT}`);