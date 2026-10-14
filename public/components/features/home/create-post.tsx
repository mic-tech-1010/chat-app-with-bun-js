import { useState } from "react";
import {
  ImagePlus,
  Link2,
  Smile,
  Send,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type CreatePostProps = {
  name: string;
  onPost: (content: string) => void;
};

export function CreatePost({ name, onPost }: CreatePostProps) {
  const [content, setContent] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) return;

    onPost(trimmedContent);
    setContent("");
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-border/70 py-0 shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {initials || "Y"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="What's on your mind?"
                aria-label="Write a post"
                className="min-h-24 resize-y border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                maxLength={4000}
              />

              <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-2 rounded-lg px-2 text-muted-foreground"
                    disabled
                    title="Image uploads will be added later"
                  >
                    <ImagePlus className="size-4" />
                    <span className="hidden sm:inline">Photo</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-2 rounded-lg px-2 text-muted-foreground"
                    disabled
                    title="Link previews will be added later"
                  >
                    <Link2 className="size-4" />
                    <span className="hidden sm:inline">Link</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 rounded-lg text-muted-foreground"
                    disabled
                    aria-label="Add emoji"
                    title="Emoji support will be added later"
                  >
                    <Smile className="size-4" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl px-4"
                  disabled={!content.trim()}
                >
                  Post
                  <Send className="ml-2 size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}