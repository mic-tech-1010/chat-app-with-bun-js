import type { ServerWebSocket } from "bun";
import { getWebSocketServer } from "./server";

export function sendJson(
  ws: ServerWebSocket,
  data: unknown,
) {
  ws.send(JSON.stringify(data));
}

export function broadcast(data: unknown) {
  const server = getWebSocketServer();

  server.publish(
    "global",
    JSON.stringify(data),
  );
}

export function broadcastToGroupSubscribers(
  groupId: number,
  data: unknown,
) {
  const server = getWebSocketServer();

  server.publish(
    `group:${groupId}`,
    JSON.stringify(data),
  );
}

export function handleMessage(
  ws: ServerWebSocket,
  data: string,
) {
  let message;

  try {
    message = JSON.parse(data);
  } catch (error) {
    console.error(
      "Failed to parse message:",
      error,
    );

    return;
  }

  if (
    message.type === "subscribe" &&
    Number.isInteger(message.groupId)
  ) {
    const channel = `group:${message.groupId}`;

    ws.subscribe(channel);

    console.log(
      `📡 WebSocket subscribed to ${channel}`,
    );

    sendJson(ws, {
      type: "subscribed",
      groupId: message.groupId,
    });

    return;
  }

  if (
    message.type === "unsubscribe" &&
    Number.isInteger(message.matchId)
  ) {
    const channel = `match:${message.groupId}`;

    ws.unsubscribe(channel);

    console.log(
      `📡 WebSocket unsubscribed from ${channel}`,
    );

    sendJson(ws, {
      type: "unsubscribed",

    });
  }
}