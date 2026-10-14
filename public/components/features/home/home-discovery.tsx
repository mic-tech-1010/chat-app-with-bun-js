import {
  ArrowUpRight,
  BadgeCheck,
  Flame,
  Plus,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const trends = [
  { category: "Technology", topic: "Building in public", posts: "2.4k posts" },
  { category: "Design", topic: "Design systems", posts: "1.8k posts" },
  { category: "Community", topic: "Creative collaboration", posts: "986 posts" },
];

const suggestions = [
  {
    name: "Daniel James",
    handle: "danielbuilds",
    initials: "DJ",
    color: "bg-sky-100 text-sky-700",
    bio: "Developer & maker",
  },
  {
    name: "Sarah Williams",
    handle: "sarahcreates",
    initials: "SW",
    color: "bg-pink-100 text-pink-700",
    bio: "Designer · Curious mind",
  },
  {
    name: "David Okafor",
    handle: "davidcodes",
    initials: "DO",
    color: "bg-emerald-100 text-emerald-700",
    bio: "Building useful things",
  },
];

export function HomeDiscovery() {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-24 space-y-5">
        <Card className="gap-0 rounded-2xl border-border/70 py-0 shadow-sm">
          <CardHeader className="flex-row items-center justify-between px-4 pt-4 pb-3">
            <CardTitle className="text-sm">Trending on Connect</CardTitle>
            <Flame className="size-4 text-orange-500" />
          </CardHeader>

          <CardContent className="px-4 pb-2">
            {trends.map((trend, index) => (
              <div key={trend.topic}>
                {index > 0 && <Separator className="my-3" />}

                <button
                  type="button"
                  className="group w-full rounded-lg text-left"
                >
                  <p className="text-xs text-muted-foreground">
                    {trend.category}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold transition-colors group-hover:text-primary">
                      {trend.topic}
                    </p>
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {trend.posts}
                  </p>
                </button>
              </div>
            ))}

            <Button
              variant="ghost"
              className="mt-3 h-9 w-full justify-start rounded-xl px-2 text-sm text-primary"
            >
              Explore topics
              <ArrowUpRight className="ml-auto size-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="gap-0 rounded-2xl border-border/70 py-0 shadow-sm">
          <CardHeader className="px-4 pt-4 pb-3">
            <CardTitle className="text-sm">
              People you may know
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 px-4 pb-4">
            {suggestions.map((person) => (
              <Suggestion key={person.handle} person={person} />
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-x-3 gap-y-2 px-2 text-xs text-muted-foreground">
          <a href="#about" className="hover:text-foreground">About</a>
          <a href="#privacy" className="hover:text-foreground">Privacy</a>
          <a href="#terms" className="hover:text-foreground">Terms</a>
          <span>© 2026 Connect</span>
        </div>
      </div>
    </aside>
  );
}

function Suggestion({
  person,
}: {
  person: (typeof suggestions)[number];
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className={person.color}>
          {person.initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-medium">{person.name}</p>
          {person.handle === "sarahcreates" && (
            <BadgeCheck className="size-3.5 shrink-0 text-primary" />
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {person.bio}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8 shrink-0 rounded-full"
        aria-label={`Follow ${person.name}`}
        title={`Follow ${person.name}`}
        onClick={(event) => {
          const button = event.currentTarget;
          const following = button.dataset.following === "true";

          button.dataset.following = String(!following);
          button.setAttribute("aria-label", following ? `Follow ${person.name}` : `Unfollow ${person.name}`);
          button.title = following ? "Follow" : "Following";
          button.innerHTML = following ? '<span>+</span>' : '<span>✓</span>';
        }}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}