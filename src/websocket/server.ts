import type { Server } from "bun";

let bunServer: Server<unknown>;

export function setWebSocketServer(server: Server<unknown>) {
  bunServer = server;

  console.log("✅ Bun WebSocket server reference initialized");
}

export function getWebSocketServer() {
  if (!bunServer) {
    throw new Error("Bun WebSocket server has not been initialized");
  }

  return bunServer;
}