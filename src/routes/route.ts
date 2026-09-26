import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { apiRouter } from "./api";
import { betterAuthRouter } from "./better-auth";


export const api = new Elysia()
  .use(
    openapi({
      // references: fromTypes(),
      path: "openapi"
    }),
  )
  .use(betterAuthRouter)
  .use(apiRouter)
  