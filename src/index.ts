import { serve } from "bun";
import index from "../public/index.html";
import { api } from "./routes/route.ts";
import { handleMessage } from "./websocket/websocket.ts";
import { setWebSocketServer } from "./websocket/server.ts";

const handleWebSocket = (
  request: Request,
  server: Bun.Server<undefined>,
) => {
  
  if (server.upgrade(request)) return;

  return new Response("WebSocket upgrade failed", {
    status: 400,
  });

};

const handleApi = (request: Request) => api.fetch(request);

const isApiRequest = (pathname: string) =>
  pathname.startsWith("/api/");

const isDocumentRequest = (request: Request) =>
  request.method === "GET" &&
  (request.headers.get("accept") ?? "").includes("text/html");

const server = serve({
  port: 3000,

  routes: {
    "/": index,
  },

  async fetch(request, server) {
    const { pathname } = new URL(request.url);

    // WebSocket
    if (pathname === "/ws") {
      return handleWebSocket(request, server);
    }

    // API
    const response = await handleApi(request);

    if (isApiRequest(pathname) || response.status !== 404) {
      return response;
    }

    // SPA fallback
    if (isDocumentRequest(request)) {
      return fetch(new URL("/", request.url));
    }

    return new Response("Not Found", {
      status: 404,
    });
  },

  websocket: {
    sendPings: true,

    open(ws) {
      // Optional: Subscribe to a global room for server-wide broadcasts
      ws.subscribe("global");
      console.log("🟢 WebSocket connected");
    },

    message(ws, message) {
      // Pass the raw message to your handler
      handleMessage(ws, message as string);
    },

    close(ws) {
      // No cleanup needed! Bun automatically removes all subscriptions 
      // for this socket when it closes.
      console.log("🔴 WebSocket disconnected");
    },

  },

  development: {
    hmr: true,
    console: true,
  },
});

setWebSocketServer(server);

console.log(`🚀 Server running at ${server.url}`);
