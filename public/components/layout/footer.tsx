import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="mt-auto border-t bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Heart className="size-3.5 fill-current" />
                        </div>

                        <span className="text-sm font-medium">Connect</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <Link
                            to="/about"
                            className="transition-colors hover:text-foreground"
                        >
                            About
                        </Link>

                        <Link
                            to="/privacy"
                            className="transition-colors hover:text-foreground"
                        >
                            Privacy
                        </Link>

                        <Link
                            to="/terms"
                            className="transition-colors hover:text-foreground"
                        >
                            Terms
                        </Link>

                        <Link
                            to="/help"
                            className="transition-colors hover:text-foreground"
                        >
                            Help
                        </Link>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Connect. All rights reserved.</p>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="size-3.5"
                        >
                            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                            />
                        </svg>
                        Built with Bun
                    </a>
                </div>
            </div>
        </footer>
    );
}