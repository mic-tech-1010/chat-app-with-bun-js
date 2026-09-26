import { Link } from "@tanstack/react-router";
import {
  Bell,
  LogIn,
  MessageCircle,
  Search,
  Settings,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "../features/mode-toggle";

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageCircle className="size-4" />
          </div>

          <span className="hidden sm:inline-block">Connect</span>
        </Link>

        <Separator
          orientation="vertical"
          className="hidden h-6 md:block"
        />

        {/* Search */}
        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search people, posts..."
            className="h-9 rounded-full bg-muted/50 pl-9"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
          >
            <Search className="size-4" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            disabled={!user}
          >
            <Bell className="size-4" />

            {user && (
              <Badge
                className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
                variant="destructive"
              >
                3
              </Badge>
            )}

            <span className="sr-only">Notifications</span>
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            disabled={!user}
          >
            <MessageCircle className="size-4" />

            {user && (
              <Badge
                className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
                variant="destructive"
              >
                2
              </Badge>
            )}

            <span className="sr-only">Messages</span>
          </Button>

          <ModeToggle />

          <Separator
            orientation="vertical"
            className="mx-2 h-6"
          />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-full px-2"
              >
                <Avatar className="size-7">
                  <AvatarFallback>
                    {isPending ? "..." : initials}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden text-sm font-medium lg:inline">
                  {isPending
                    ? "Loading..."
                    : user?.name ?? "Account"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56"
            >
              {user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {user.name}
                        </span>

                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={async () => {
                      await authClient.signOut();
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        Welcome to Connect
                      </span>

                      <span className="text-xs font-normal text-muted-foreground">
                        Sign in to join the conversation.
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/login">
                      <LogIn className="mr-2 size-4" />
                      Sign in
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/login">
                      <User className="mr-2 size-4" />
                      Create account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

