import { Elysia } from "elysia"
import { staticPlugin } from "@elysiajs/static"
import { openapi, fromTypes } from "@elysiajs/openapi"
import { auth } from "./lib/auth"

const betterAuth = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        })

        if (!session) {
          return status(401)
        }

        return {
          user: session.user,
          session: session.session,
        }
      },
    },
  })

export const app = new Elysia()
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .use(
    await staticPlugin({
      prefix: "/",
    }),
  )
  .use(betterAuth)
  .get("/message", { message: "Hello from server" } as const)
  .get(
    "/user",
    ({ user }) => user,
    {
      auth: true,
    },
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)