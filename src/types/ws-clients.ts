import { WebSocket } from "ws";

export type WebSocketClients = Map<string, {id: string, ws: WebSocket}>;