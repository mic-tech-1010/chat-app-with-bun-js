import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { backendUrl } from "@/lib/api";

import {
  ConversationSidebar,
  type ConversationSummary,
} from "./conversation-sidebar";
import { ChatThread } from "./chat-thread";

type RawMember = {
  userId?: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string;
  };
};

type RawConversation = {
  id?: string;
  name?: string | null;
  type?: string;
  updatedAt?: string;
  createdAt?: string;
  lastMessage?: {
    content?: string;
    createdAt?: string;
  } | null;
  members?: RawMember[];
};

type RawMembership = {
  conversation?: RawConversation;
  conversationId?: string;
};

function unwrapList(result: unknown): unknown[] {
  if (Array.isArray(result)) return result;

  if (result && typeof result === "object") {
    if ("data" in result && Array.isArray(result.data)) {
      return result.data;
    }

    if ("conversations" in result && Array.isArray(result.conversations)) {
      return result.conversations;
    }
  }

  return [];
}

function getConversationName(
  conversation: RawConversation,
  currentUserId: string,
) {
  if (conversation.name?.trim()) return conversation.name.trim();

  const otherMember = conversation.members?.find((member) => {
    const memberId = member.userId ?? member.user?.id;
    return memberId && memberId !== currentUserId;
  });

  if (otherMember?.user?.name) return otherMember.user.name;
  if (otherMember?.user?.email) return otherMember.user.email;

  return conversation.type === "GROUP"
    ? "Group conversation"
    : "Direct conversation";
}

function normalizeConversations(
  result: unknown,
  currentUserId: string,
): ConversationSummary[] {
  const rows = unwrapList(result);

  return rows
    .map((row): ConversationSummary | null => {
      if (!row || typeof row !== "object") return null;

      const membership = row as RawMembership & RawConversation;
      const conversation = membership.conversation ?? membership;

      if (!conversation.id) return null;

      return {
        id: conversation.id,
        name: getConversationName(conversation, currentUserId),
        type: conversation.type ?? "DIRECT",
        updatedAt: conversation.updatedAt ?? conversation.createdAt,
        lastMessage: conversation.lastMessage ?? null,
      };
    })
    .filter((item): item is ConversationSummary => item !== null);
}

async function fetchConversations(
  currentUserId: string,
): Promise<ConversationSummary[]> {
  const response = await fetch(`/api/v1/conversations`, {
    credentials: "same-origin",
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : "Unable to load your conversations.";

    throw new Error(message);
  }

  return normalizeConversations(result, currentUserId);
}

export function ChatPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const user = session?.user;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const conversationsQuery = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: () => fetchConversations(user!.id),
    enabled: Boolean(user?.id),
  });

  const conversations = conversationsQuery.data ?? [];

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      // Keep the conversation list visible initially on narrow screens.
      if (window.matchMedia("(min-width: 768px)").matches) {
        setSelectedId(conversations?.[0]?.id || null);
      }
    }
  }, [conversations, selectedId]);

  const selectedConversation =
    conversations.find((item) => item.id === selectedId) ?? null;

  if (isSessionPending) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Checking your session…
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-muted/20 p-4">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageCircle className="size-6" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">Your conversations await</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in to access your conversations and send messages.
          </p>

          <Button asChild className="mt-6 w-full rounded-xl">
            <Link to="/login">Sign in to Connect</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 p-0 md:p-4 lg:p-6">
      <div className="mx-auto flex h-[calc(100dvh-4rem)] min-h-[520px] max-w-[1600px] overflow-hidden border bg-card shadow-sm md:h-[calc(100dvh-7rem)] md:rounded-2xl lg:rounded-3xl">
        <ConversationSidebar
          conversations={conversations}
          selectedId={selectedId}
          isLoading={conversationsQuery.isPending}
          error={conversationsQuery.error?.message}
          onSelect={setSelectedId}
          onRetry={() => conversationsQuery.refetch()}
          onNewConversation={() => {
            window.alert(
              "Creating a new conversation requires a conversation-creation API endpoint.",
            );
          }}
          onBackHome={() => {
            window.location.href = "/";
          }}
        />

        {selectedConversation ? (
          <ChatThread
            key={selectedConversation.id}
            conversation={selectedConversation}
            currentUserId={user.id}
            currentUserName={user.name ?? "You"}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <section
            className={`${
              selectedId ? "flex" : "hidden md:flex"
            } min-w-0 flex-1 flex-col items-center justify-center bg-background px-6 text-center`}
          >
            <div className="flex size-16 items-center justify-center rounded-3xl border bg-card shadow-sm">
              <MessageCircle className="size-7 text-primary" />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-tight">
              Your space to connect
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Choose a conversation to pick up where you left off, or start
              exploring your messages.
            </p>

            {conversationsQuery.isError && (
              <Button
                variant="outline"
                className="mt-5 rounded-xl"
                onClick={() => conversationsQuery.refetch()}
              >
                Try loading again
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              className="mt-3 rounded-xl"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to home
              </Link>
            </Button>
          </section>
        )}
      </div>
    </div>
  );
}