import { t } from "elysia";

export const createMessageSchema = t.Object({
  content: t.String({
    minLength: 1,
    maxLength: 4000,
  }),
});

export const conversationIdParamSchema = t.Object({
  id: t.String({ format: "uuid" }),
});