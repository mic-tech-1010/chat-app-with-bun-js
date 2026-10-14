import { useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share2,
  BadgeCheck,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type Post = {
  id: string;
  author: string;
  handle: string;
  initials: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  verified?: boolean;
  avatarColor: string;
};

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(post.content);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      console.error("Unable to copy post.");
    }
  }

  return (
    <Card className="gap-0 rounded-2xl border-border/70 py-0 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex-row items-center gap-3 space-y-0 p-4 pb-3 sm:p-5 sm:pb-3">
        <Avatar className="size-11 shrink-0">
          <AvatarFallback
            className={`${post.avatarColor} font-semibold`}
          >
            {post.initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-semibold">
              {post.author}
            </span>

            {post.verified && (
              <BadgeCheck
                className="size-4 fill-primary text-primary-foreground"
                aria-label="Verified account"
              />
            )}

            <span className="text-xs text-muted-foreground">
              · {post.time}
            </span>
          </div>

          <p className="truncate text-xs text-muted-foreground">
            @{post.handle}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full text-muted-foreground"
          aria-label="More post options"
          title="More post options"
          disabled
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4 sm:px-5">
        <p className="text-sm leading-7 whitespace-pre-wrap">
          {post.content}
        </p>
      </CardContent>

      <div className="px-4 sm:px-5">
        <div className="flex items-center justify-between pb-3 text-xs text-muted-foreground">
          <span>
            {post.likes + Number(liked)}{" "}
            {(post.likes + Number(liked)) === 1 ? "like" : "likes"}
          </span>
          <span>
            {post.comments} {post.comments === 1 ? "comment" : "comments"}
          </span>
        </div>

        <Separator />
      </div>

      <CardFooter className="grid grid-cols-4 gap-1 p-2 sm:px-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setLiked((current) => !current)}
          aria-pressed={liked}
          className={`h-10 gap-1.5 rounded-xl px-1 text-xs sm:gap-2 sm:text-sm ${
            liked ? "text-rose-600 hover:text-rose-600" : "text-muted-foreground"
          }`}
        >
          <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
          Like
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 gap-1.5 rounded-xl px-1 text-xs text-muted-foreground sm:gap-2 sm:text-sm"
          disabled
          title="Comments will be added next"
        >
          <MessageCircle className="size-4" />
          Comment
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-10 gap-1.5 rounded-xl px-1 text-xs text-muted-foreground sm:gap-2 sm:text-sm"
          disabled
          title="Reposting will be added later"
        >
          <Repeat2 className="size-4" />
          Repost
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-10 gap-1.5 rounded-xl px-1 text-xs text-muted-foreground sm:gap-2 sm:text-sm"
        >
          {shared ? (
            <Share2 className="size-4 text-primary" />
          ) : saved ? (
            <Bookmark className="size-4" />
          ) : (
            <Share2 className="size-4" />
          )}
          {shared ? "Copied" : "Share"}
        </Button>
      </CardFooter>
    </Card>
  );
}