import "../css/index.css";
import {
  createRootRoute,
  Link,
  Outlet,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <div>
      <h1>404</h1>
      <Link to="/">Go home</Link>
    </div>
  ),
});

function RootLayout() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}