import { serve } from "bun";
import index from "../public/index.html";
import { api } from "./routes/route.ts";

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

    if (response.status !== 404 || isApiRequest(pathname)) {
      return response;
    }

    // SPA fallback
    if (isDocumentRequest(request)) {
      return fetch(new URL("/", request.url));
    }

    return response;
  },

  websocket: {
    sendPings: true,

    open(ws) {},

    message(ws, message) {},

    close(ws) {},
  },

  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);