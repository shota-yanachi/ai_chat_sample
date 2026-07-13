import * as repo from "../infrastructure/api/apiAiChatRepository";
import type { AiChatConversationSummary, AiChatMessage, AiChatState } from "../domain/types";

export async function listSessions(
  userExternalId: string,
): Promise<AiChatConversationSummary[]> {
  await repo.ensureUser(userExternalId);
  const conversations = await repo.listConversations(userExternalId);
  return [...conversations].sort(
    (a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime(),
  );
}

export async function startNewSession(userExternalId: string): Promise<string> {
  return repo.createConversation(userExternalId);
}

function buildGreeting(): AiChatMessage {
  return {
    id: crypto.randomUUID(),
    text: "こんにちは!AIチャットです。製品や猫ちゃんについての質問をお聞かせください♪",
    sender: "ai",
    createdAt: new Date().toISOString(),
  };
}

export async function loadSession(
  conversationId: string,
  userExternalId: string,
): Promise<AiChatState> {
  const history = await repo.fetchMessages(conversationId);
  const messages = history.length > 0 ? history : [buildGreeting()];
  return { conversationId, userExternalId, messages, isSending: false };
}

export async function sendMessage(
  conversationId: string,
  userExternalId: string,
  text: string,
): Promise<void> {
  await repo.sendMessage(conversationId, userExternalId, text);
}

export { subscribeToIncomingMessages } from "../infrastructure/api/apiAiChatRepository";
