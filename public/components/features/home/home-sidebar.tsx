import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Compass,
  Hash,
  House,
  MessageCircle,
  Plus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { label: "Home", icon: House, active: true },
  { label: "Explore", icon: Compass },
  { label: "Messages", icon: MessageCircle },
  { label: "Communities", icon: Users },
  { label: "Topics", icon: Hash },
  { label: "Bookmarks", icon: Bookmark },
];

export function HomeSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-24 space-y-6">
        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon, active }) => (
            <Button
              key={label}
              variant={active ? "secondary" : "ghost"}
              className={`h-11 w-full justify-start gap-3 rounded-xl px-3 ${
                active
                  ? "font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              asChild={label === "Home"}
            >
              {label === "Home" ? (
                <Link to="/">
                  <Icon className="size-5" />
                  {label}
                </Link>
              ) : (
                <>
                  <Icon className="size-5" />
                  {label}
                </>
              )}
            </Button>
          ))}
        </nav>

        <Button className="h-11 w-full rounded-xl">
          <Plus className="mr-2 size-4" />
          Create a community
        </Button>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Your communities</h2>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 rounded-full"
              aria-label="Add a community"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          {[
            { name: "Web Developers", initials: "WD", color: "bg-blue-100 text-blue-700" },
            { name: "Design Circle", initials: "DC", color: "bg-violet-100 text-violet-700" },
            { name: "Startup Stories", initials: "SS", color: "bg-amber-100 text-amber-700" },
          ].map((community) => (
            <button
              key={community.name}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted"
            >
              <Avatar className="size-9 rounded-xl">
                <AvatarFallback
                  className={`rounded-xl text-xs font-semibold ${community.color}`}
                >
                  {community.initials}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-medium">
                {community.name}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm font-semibold">Good conversations start here.</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Find people who share your interests and build something together.
          </p>
          <Button variant="outline" className="mt-4 w-full rounded-xl" size="sm">
            Discover people
          </Button>
        </div>
      </div>
    </aside>
  );
}