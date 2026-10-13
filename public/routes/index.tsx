import { createFileRoute } from "@tanstack/react-router";
import { UseWebsocket } from "../hooks/useWebsocket";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {

  const { sendMessage } = UseWebsocket();

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the application.</p>
      <Button onClick={() => sendMessage({ message: 'Hello World!' })}>
        send Message
      </Button>
    </div>
  );
}