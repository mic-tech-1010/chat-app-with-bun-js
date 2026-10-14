import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { authClient } from "@/lib/auth-client";
import { HomeSidebar } from "@/components/features/home/home-sidebar";
import { CreatePost } from "@/components/features/home/create-post";
import { HomeDiscovery } from "@/components/features/home/home-discovery";
import { PostCard, type Post } from "@/components/features/home/post-card";

const initialPosts: Post[] = [
  {
    id: "post-1",
    author: "Daniel James",
    handle: "danielbuilds",
    initials: "DJ",
    time: "12 min ago",
    content:
      "A reminder for anyone learning to build things: you don't need to understand everything before you start. Build something small, learn from what breaks, and keep going. Progress comes from showing up consistently. 🚀",
    likes: 28,
    comments: 6,
    verified: true,
    avatarColor: "bg-sky-100 text-sky-700",
  },
  {
    id: "post-2",
    author: "Sarah Williams",
    handle: "sarahcreates",
    initials: "SW",
    time: "38 min ago",
    content:
      "What makes a great online community isn't the number of people in it. It's how comfortable people feel asking questions, sharing unfinished ideas, and helping each other grow.\n\nLet's build more spaces like that.",
    likes: 46,
    comments: 12,
    verified: true,
    avatarColor: "bg-pink-100 text-pink-700",
  },
  {
    id: "post-3",
    author: "David Okafor",
    handle: "davidcodes",
    initials: "DO",
    time: "1 hour ago",
    content:
      "Small win today: finally shipped a feature I'd been putting off for weeks. Nothing fancy, just one problem solved and one more thing learned. What are you working on this week?",
    likes: 19,
    comments: 4,
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
];

export function HomePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [posts, setPosts] = useState(initialPosts);
  const [feedMode, setFeedMode] = useState<"for-you" | "following">("for-you");

  const displayName = user?.name?.trim().split(/\s+/)[0] || "there";

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "Y";

  function handleCreatePost(content: string) {
    const newPost: Post = {
      id: crypto.randomUUID(),
      author: user?.name || "You",
      handle: user?.email?.split("@")[0] || "you",
      initials,
      time: "Just now",
      content,
      likes: 0,
      comments: 0,
      avatarColor: "bg-primary/10 text-primary",
    };

    setPosts((current) => [newPost, ...current]);
    setFeedMode("for-you");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[240px_minmax(0,640px)_288px] xl:gap-8">
          <HomeSidebar />

          <main className="min-w-0 space-y-6">
            <section className="relative overflow-hidden rounded-3xl border bg-card p-5 shadow-sm sm:p-7">
              <div className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative">
                <Badge
                  variant="secondary"
                  className="mb-4 gap-1.5 rounded-full px-3 py-1"
                >
                  <Sparkles className="size-3.5" />
                  Your community, your space
                </Badge>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Good to see you, {displayName}.
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                  Discover fresh ideas, catch up with your community, and
                  share what's on your mind.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex -space-x-2">
                    {[
                      "bg-sky-100 text-sky-700",
                      "bg-pink-100 text-pink-700",
                      "bg-emerald-100 text-emerald-700",
                      "bg-violet-100 text-violet-700",
                    ].map((color, index) => (
                      <Avatar
                        key={color}
                        className="size-8 border-2 border-card"
                      >
                        <AvatarFallback className={`text-[10px] ${color}`}>
                          {["DJ", "SW", "DO", "AM"][index]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <span className="text-xs text-muted-foreground">
                    Good conversations start with you.
                  </span>
                </div>
              </div>
            </section>

            <CreatePost name={user?.name || "You"} onPost={handleCreatePost} />

            <section aria-label="Community feed" className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Your feed
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    A little inspiration from your community.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 rounded-xl"
                  onClick={() =>
                    setFeedMode((mode) =>
                      mode === "for-you" ? "following" : "for-you",
                    )
                  }
                >
                  {feedMode === "for-you" ? "For you" : "Following"}
                  <ArrowDown className="size-3.5" />
                </Button>
              </div>

              <Separator />

              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card/60 px-5 py-8 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="size-5" />
                </div>

                <h3 className="mt-3 text-sm font-semibold">
                  You're all caught up
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                  More conversations will appear here as your community grows.
                </p>

                <Button variant="link" className="mt-2 gap-1 text-sm">
                  Discover communities
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </div>
            </section>
          </main>

          <HomeDiscovery />
        </div>
      </div>
    </div>
  );
}