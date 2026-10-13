import { db } from "./db";

// const conversation = await db.orm.public.Conversation.create({
//   type: "DIRECT",
// });

// console.log(conversation);

const conversationId = "47b51a7b-e090-4e53-8089-8da34b6be0e7";

await db.orm.public.ConversationMember.create({
  conversationId,
  userId: "OI8ugdUrdxTgQ4z2a3LRff5PYaVkTsRM",
});

await db.orm.public.ConversationMember.create({
  conversationId,
  userId: "fGHd5r2hc1HMPxajKmvi8GnZ9qzb2B8u",
});

console.log("Conversation memberships created.");