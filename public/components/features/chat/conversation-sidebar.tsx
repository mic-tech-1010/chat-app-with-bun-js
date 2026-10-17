import { useMemo, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export type ConversationSummary = {
  id: string;
  name: string;
  type: "DIRECT" | "GROUP" | string;
  updatedAt?: string;
  lastMessage?: {
    content?: string;
    createdAt?: string;
  } | null;
};

type ConversationSidebarProps = {
  conversations: ConversationSummary[];
  selectedId: string | null;
  currentUserId?: string;
  isLoading: boolean;
  error?: string;
  onSelect: (conversationId: string) => void;
  onRetry: () => void;
  onNewConversation: () => void;
  onBackHome: () => void;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatConversationTime(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export function ConversationSidebar({
  conversations,
  selectedId,
  currentUserId,
  isLoading,
  error,
  onSelect,
  onRetry,
  onNewConversation,
  onBackHome,
}: ConversationSidebarProps) {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(query),
    );
  }, [conversations, search]);

  return (
    <aside
      className={`${
        selectedId ? "hidden md:flex" : "flex"
      } min-h-0 w-full flex-col border-r bg-card md:w-[320px] md:shrink-0 xl:w-[360px]`}
    >
      <div className="space-y-5 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-xl md:hidden"
              onClick={onBackHome}
              aria-label="Back to home"
            >
              <ArrowLeft className="size-4" />
            </Button>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Messages
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Your conversations, all in one place.
              </p>
            </div>
          </div>

          <Button
            size="icon"
            className="size-9 shrink-0 rounded-xl"
            onClick={onNewConversation}
            aria-label="New conversation"
            title="New conversation"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            className="h-10 rounded-xl bg-muted/50 pl-9"
            aria-label="Search conversations"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent conversations
          </span>

          <Badge variant="secondary" className="rounded-full text-xs">
            {conversations.length}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2 p-2" aria-label="Loading conversations">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 rounded-xl p-3"
              >
                <div className="size-11 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm font-medium">Couldn't load conversations</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={onRetry}
            >
              Try again
            </Button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {search ? (
                <Search className="size-5" />
              ) : (
                <MessageCircle className="size-5" />
              )}
            </div>

            <p className="mt-4 text-sm font-semibold">
              {search ? "No matching conversations" : "Nothing here yet"}
            </p>

            <p className="mt-1 max-w-[220px] text-xs leading-5 text-muted-foreground">
              {search
                ? "Try another name or search term."
                : "Start a conversation and it will appear here."}
            </p>

            {!search && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl"
                onClick={onNewConversation}
              >
                <Plus className="mr-2 size-4" />
                New conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => {
              const active = conversation.id === selectedId;
              const group = conversation.type === "GROUP";

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                    active
                      ? "bg-primary/10"
                      : "hover:bg-muted/70"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  <Avatar className="size-11 shrink-0 rounded-2xl">
                    <AvatarFallback
                      className={`rounded-2xl ${
                        group
                          ? "bg-violet-100 text-violet-700"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {group ? (
                        <Users className="size-5" />
                      ) : (
                        getInitials(conversation.name || "Chat")
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-sm ${
                          active ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {conversation.name}
                      </span>

                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatConversationTime(
                          conversation.lastMessage?.createdAt ??
                            conversation.updatedAt,
                        )}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {conversation.lastMessage?.content ??
                        (group
                          ? "Group conversation"
                          : "Start a conversation")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center gap-3 p-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageCircle className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Connect messages</p>
          <p className="text-xs text-muted-foreground">
            Private conversations
          </p>
        </div>

        <span
          className="size-2 rounded-full bg-emerald-500"
          aria-label="Messaging available"
        />
      </div>
    </aside>
  );
}