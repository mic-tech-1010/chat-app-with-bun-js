import Elysia from "elysia";
import { betterAuthRouter } from "../better-auth";
import { db } from "../../prisma/db"
import { conversationIdParamSchema, createMessageSchema } from "@/server/schema/conversation";

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
    .get(
        "/conversations",
        async ({ user }) => {
            const memberships = await db.orm.public.ConversationMember
                .where({ userId: user.id })
                .include("conversation")
                .all();
            const conversations = memberships.map((membership) => membership.conversation);
            return conversations;
        },
        {
            auth: true,
        }
    )
    .get(
        "/conversations/:id/messages",
        async ({ params, user, status }) => {

            // Check if the user is a member of the conversation
            const membership = await db.orm.public.ConversationMember
                .where({
                    conversationId: params.id,
                    userId: user.id,
                })
                .first();

            if (!membership) {
                return status(403, {
                    message: "You are not a member of this conversation",
                });
            }

            const messages = await db.orm.public. Message
            .where({
                conversationId: params.id,
            })
            .orderBy((u) => u.createdAt.asc())
            .all();

            return messages;
        },
        {
            auth: true,
            params: conversationIdParamSchema,
        }
    )
    .post(
        "/conversations/:id/messages",
        async ({ body, params, user, status }) => {
            const membership = await db.orm.public.ConversationMember
                .where({
                    conversationId: params.id,
                    userId: user.id,
                })
                .first();

            if (!membership) {
                return status(403, {
                    message: "You are not a member of this conversation",
                });
            }

            const message = await db.orm.public.Message.create({
                content: body.content,
                conversationId: params.id,
                senderId: user.id,
            });

            return status(201, message);
        },
        {
            auth: true,
            body: createMessageSchema,
            params: conversationIdParamSchema,
        },
    )
