import { WebSocketServer } from "ws";

const handleRequest = (ws: WebSocket, request: any, server: WebSocketServer) => {
    console.log('handle');
}

export {handleRequest};