import type { Server } from "bun";
import type { WebSocketData } from "../types";

let bunServer: Server<WebSocketData>;

export function setWebSocketServer(server: Server<WebSocketData>) {
  bunServer = server;

  console.log("✅ Bun WebSocket server reference initialized");
}

export function getWebSocketServer() {
  if (!bunServer) {
    throw new Error("Bun WebSocket server has not been initialized");
  }

  return bunServer;
}