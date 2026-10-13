import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";

export function SocialAuth() {
  const socialSignInMutation = useMutation({
    mutationKey: ["auth", "social-sign-in", "github"],

    mutationFn: async () => {
      const { data, error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return (
    <>
      <FieldSeparator className="text-sm text-foreground bg-transparent">
        Or continue with
      </FieldSeparator>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={socialSignInMutation.isPending}
        onClick={() => socialSignInMutation.mutate()}
      >
        {socialSignInMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-3.5"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
            />
          </svg>
        )}
        Continue with GitHub
      </Button>

      {socialSignInMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {socialSignInMutation.error.message}
        </p>
      )}
    </>
  );
}
