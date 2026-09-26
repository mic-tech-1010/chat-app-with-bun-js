import Elysia from "elysia";
import { betterAuthRouter } from "../better-auth";

export const apiRouter = new Elysia({ prefix: "api/v1" })
    .use(betterAuthRouter)
    .get("/message", () => ({
        message: "Hello from server",
    }))
    .get(
        "/user",
        ({ user }) => user,
        {
            auth: true,
        },
    )
