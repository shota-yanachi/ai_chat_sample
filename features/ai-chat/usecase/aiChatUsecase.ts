import * as repo from "../infrastructure/api/apiAiChatRepository";
import type { AiChatState } from "../domain/types";

const INITIAL_REMAINING_COUNT = 5;

export async function resumeOrStartConversation(
  userExternalId: string,
): Promise<AiChatState> {
  await repo.ensureUser(userExternalId);

  const conversations = await repo.listConversations(userExternalId);
  const conversationId =
    conversations.length > 0
      ? conversations[0].id
      : await repo.createConversation(userExternalId);

  const history = await repo.fetchMessages(conversationId);

  const messages =
    history.length > 0
      ? history
      : [
          {
            id: crypto.randomUUID(),
            text: "こんにちは!AIチャットです。製品や猫ちゃんについての質問をお聞かせください♪",
            sender: "ai" as const,
            createdAt: new Date().toISOString(),
          },
        ];

  const sentCount = history.filter((m) => m.sender === "user").length;
  const remainingCount = Math.max(0, INITIAL_REMAINING_COUNT - sentCount);

  return { conversationId, userExternalId, messages, remainingCount, isSending: false };
}

export async function sendMessage(
  conversationId: string,
  userExternalId: string,
  text: string,
): Promise<void> {
  await repo.sendMessage(conversationId, userExternalId, text);
}

export { subscribeToIncomingMessages } from "../infrastructure/api/apiAiChatRepository";
