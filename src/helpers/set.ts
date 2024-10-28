import { randomUUID } from "crypto";
import { WebSocketClients } from "../types/ws-clients";
import { WebSocket } from "ws";

export const setWsClient = (wsClients: WebSocketClients, ws: WebSocket): string => {
  const clientId = randomUUID();
  wsClients.set(clientId, {id: clientId, ws});
  return clientId;
} 
