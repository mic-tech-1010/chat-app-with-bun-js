import "../css/index.css";

import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { NotFound } from "@/components/layout/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import { queryClient } from "@/lib/query-client";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isAuthPage = pathname === "/login";

  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        {isAuthPage ? (
          <Outlet />
        ) : (
          <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1">
              <Outlet />
            </main>

            <Footer />
          </div>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

