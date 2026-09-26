import { Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg overflow-hidden">
        <CardHeader className="text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <Compass className="size-7 text-muted-foreground" />
          </div>

          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Error 404
          </div>

          <CardTitle className="text-3xl tracking-tight">
            Page not found
          </CardTitle>

          <CardDescription className="mx-auto max-w-sm text-base">
            The page you're looking for doesn't exist or may have been moved
            somewhere else.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Search className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

              <div className="space-y-1">
                <p className="text-sm font-medium">Looking for something?</p>
                <p className="text-sm text-muted-foreground">
                  Try searching for a person, conversation, or post from the
                  main page.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-col gap-2 p-6 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/">
              <Home className="mr-2 size-4" />
              Back to home
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 size-4" />
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}