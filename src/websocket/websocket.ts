import type { ServerWebSocket } from "bun";
import { getWebSocketServer } from "./server";
import type { WebSocketData } from "../types";
import { db } from "../prisma/db";

export function sendJson(
  ws: ServerWebSocket<WebSocketData>,
  data: unknown,
) {
  ws.send(JSON.stringify(data));
}

export function broadcastToConversationMembers(
  conversationId: string,
  data: unknown,
) {
  const server = getWebSocketServer();

  server.publish(
    `conversation:${conversationId}`,
    JSON.stringify(data),
  );
}

export async function handleMessage(
  ws: ServerWebSocket<WebSocketData>,
  data: string,
) {
  let message: unknown;

  try {
    message = JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse message:", error);
    sendJson(ws, {
      type: "error",
      message: "Invalid JSON message",
    });
    return;
  }

  if (
    typeof message !== "object" ||
    message === null ||
    !("type" in message) ||
    !("conversationId" in message) ||
    typeof message.type !== "string" ||
    typeof message.conversationId !== "string"
  ) {
    sendJson(ws, {
      type: "error",
      message: "Invalid message format",
    });
    return;
  }

  const { type, conversationId } = message;
  const channel = `conversation:${conversationId}`;

  if (type === "unsubscribe") {
    ws.unsubscribe(channel);

    sendJson(ws, {
      type: "unsubscribed",
      conversationId,
    });
    return;
  }

  const membership = await db.orm.public.ConversationMember
    .where({
      conversationId: conversationId,
      userId: ws.data.userId,
    })
    .first();

  if (!membership) {
    sendJson(ws, {
      type: "error",
      message: "You are not a member of this conversation",
    });
    return;
  }

  if (type === "subscribe") {
    ws.subscribe(channel);

    sendJson(ws, {
      type: "subscribed",
      conversationId,
    });
    return;
  }

  sendJson(ws, {
    type: "error",
    message: "Unsupported message type",
  });
}


