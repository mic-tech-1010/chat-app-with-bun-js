import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { backendUrl } from "@/lib/api";
import type { ConversationSummary } from "./conversation-sidebar";

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

type ChatThreadProps = {
  conversation: ConversationSummary;
  currentUserId: string;
  currentUserName: string;
  onBack: () => void;
};

async function readResponse<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return result as T;
}

function normalizeMessages(result: unknown): ChatMessage[] {
  if (Array.isArray(result)) return result as ChatMessage[];

  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    Array.isArray(result.data)
  ) {
    return result.data as ChatMessage[];
  }

  return [];
}

function addMessage(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  message: ChatMessage,
) {
  if (message.conversationId !== conversationId) return;

  queryClient.setQueryData<ChatMessage[]>(
    ["conversation-messages", conversationId],
    (previous = []) => {
      if (previous.some((item) => item.id === message.id)) {
        return previous;
      }

      return [...previous, message].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      );
    },
  );
}

function formatMessageTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatThread({
  conversation,
  currentUserId,
  currentUserName,
  onBack,
}: ChatThreadProps) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [socketStatus, setSocketStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const messagesQueryKey = [
    "conversation-messages",
    conversation.id,
  ] as const;

  const messagesQuery = useQuery({
    queryKey: messagesQueryKey,
    queryFn: async () => {
      const response = await fetch(
        `/api/v1/conversations/${conversation.id}/messages`,
        { credentials: "same-origin" },
      );

      return normalizeMessages(await readResponse<unknown>(response));
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      const response = await fetch(
        `/api/v1/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: messageContent }),
        },
      );

      return readResponse<ChatMessage>(response);
    },
    onSuccess: (message) => {
      addMessage(queryClient, conversation.id, message);
      setContent("");
    },
  });

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;

    setSocketStatus("connecting");

    try {
      socket = new WebSocket(
        `${backendUrl.replace(/^http/, "ws")}/ws`,
      );

      socketRef.current = socket;

      socket.onopen = () => {
        if (!active) return;

        setSocketStatus("connected");

        socket?.send(
          JSON.stringify({
            type: "subscribe",
            conversationId: conversation.id,
          }),
        );
      };

      socket.onmessage = (event) => {
        if (!active) return;

        try {
          const payload: unknown = JSON.parse(event.data);

          if (!payload || typeof payload !== "object") return;

          if (
            "type" in payload &&
            payload.type === "message.created" &&
            "data" in payload &&
            payload.data &&
            typeof payload.data === "object"
          ) {
            addMessage(
              queryClient,
              conversation.id,
              payload.data as ChatMessage,
            );
          }

          if (
            "type" in payload &&
            payload.type === "error" &&
            "message" in payload
          ) {
            console.error("WebSocket error:", payload.message);
          }
        } catch (error) {
          console.error("Unable to process WebSocket event:", error);
        }
      };

      socket.onerror = () => {
        if (active) setSocketStatus("disconnected");
      };

      socket.onclose = () => {
        if (active) setSocketStatus("disconnected");
      };
    } catch (error) {
      console.error("Unable to connect to WebSocket:", error);
      setSocketStatus("disconnected");
    }

    return () => {
      active = false;

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "unsubscribe",
            conversationId: conversation.id,
          }),
        );
      }

      socket?.close();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [conversation.id, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQuery.data?.length]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || sendMutation.isPending) return;

    sendMutation.mutate(trimmedContent);
  }

  const messages = messagesQuery.data ?? [];

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
      <header className="flex h-[76px] shrink-0 items-center gap-3 border-b px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl md:hidden"
          onClick={onBack}
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Avatar className="size-10 shrink-0 rounded-xl">
          <AvatarFallback className="rounded-xl bg-primary/10 font-semibold text-primary">
            {conversation.name
              .split(/\s+/)
              .filter(Boolean)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "C"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold">
            {conversation.name}
          </h2>

          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full ${
                socketStatus === "connected"
                  ? "bg-emerald-500"
                  : socketStatus === "connecting"
                    ? "bg-amber-500"
                    : "bg-muted-foreground/50"
              }`}
            />

            <span className="text-xs text-muted-foreground">
              {socketStatus === "connected"
                ? "Real-time connected"
                : socketStatus === "connecting"
                  ? "Connecting…"
                  : "Reconnecting requires refresh"}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl text-muted-foreground"
          aria-label="More conversation options"
          title="More options"
          disabled
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
          <div className="mb-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border bg-card shadow-sm">
              <MessageCircle className="size-6 text-primary" />
            </div>

            <h3 className="mt-3 text-sm font-semibold">
              {conversation.name}
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              This is the beginning of your conversation.
            </p>

            <Badge variant="secondary" className="mt-3 rounded-full">
              <Smile className="mr-1.5 size-3" />
              Keep it friendly
            </Badge>
          </div>

          {messagesQuery.isPending ? (
            <div className="space-y-4" aria-label="Loading messages">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`flex animate-pulse ${
                    item % 2 ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="h-14 w-2/3 max-w-sm rounded-2xl bg-muted" />
                </div>
              ))}
            </div>
          ) : messagesQuery.isError ? (
            <div className="m-auto max-w-sm py-10 text-center">
              <p className="text-sm font-semibold">
                Couldn't load messages
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {messagesQuery.error.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl"
                onClick={() => messagesQuery.refetch()}
              >
                Try again
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="m-auto py-10 text-center">
              <p className="text-sm font-medium">Say hello 👋</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Your first message can start something great.
              </p>
            </div>
          ) : (
            <div className="mt-auto space-y-5">
              {messages.map((message, index) => {
                const mine = message.senderId === currentUserId;
                const previous = messages[index - 1];

                const showDate =
                  !previous ||
                  new Date(previous.createdAt).toDateString() !==
                    new Date(message.createdAt).toDateString();

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="my-6 flex items-center gap-3">
                        <Separator className="flex-1" />
                        <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <Separator className="flex-1" />
                      </div>
                    )}

                    <div
                      className={`flex items-end gap-2 ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!mine && (
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback className="bg-muted text-[10px]">
                            {conversation.name.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] ${
                          mine ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        {!mine && (
                          <span className="mb-1 px-1 text-[10px] text-muted-foreground">
                            {conversation.type === "GROUP"
                              ? "Conversation member"
                              : conversation.name}
                          </span>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-6 break-words whitespace-pre-wrap ${
                            mine
                              ? "rounded-br-md bg-primary text-primary-foreground"
                              : "rounded-bl-md border bg-card"
                          }`}
                        >
                          {message.content}
                        </div>

                        <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                          <span>{formatMessageTime(message.createdAt)}</span>

                          {mine && (
                            <CheckCheck className="size-3.5 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <footer className="shrink-0 border-t bg-card/70 p-3 sm:p-5">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl"
        >
          {sendMutation.isError && (
            <p role="alert" className="mb-2 text-xs text-destructive">
              {sendMutation.error.message}
            </p>
          )}

          <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm transition-colors focus-within:border-primary/40">
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={`Message ${conversation.name}…`}
              aria-label="Write a message"
              maxLength={4000}
              rows={1}
              className="max-h-36 min-h-10 resize-none border-0 bg-transparent px-2 py-2.5 shadow-none focus-visible:ring-0"
            />

            <Button
              type="submit"
              size="icon"
              className="mb-0.5 size-9 shrink-0 rounded-xl"
              disabled={!content.trim() || sendMutation.isPending}
              aria-label="Send message"
            >
              {sendMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>

          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </footer>
    </section>
  );
}