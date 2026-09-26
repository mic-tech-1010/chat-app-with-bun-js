import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./sign-in";
import { SignUpForm } from "./sign-up";

export function AuthPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-5 flex items-center gap-2 font-semibold tracking-tight"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <MessageCircle className="size-5" />
            </div>

            <span className="text-xl">Connect</span>
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Connect
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Connect with people and keep your conversations in one place.
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-4">
            <SignInForm />
          </TabsContent>

          <TabsContent value="signup" className="mt-4">
            <SignUpForm />
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}