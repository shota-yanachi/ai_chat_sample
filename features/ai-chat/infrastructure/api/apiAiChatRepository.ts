import { aiChatFetch } from "./aiChatClient";
import type { AiChatConversationSummary, AiChatMessage } from "../../domain/types";

interface RawMessage {
  id: string;
  content?: { text?: string };
  author?: { type?: "user" | "business" };
  received: string;
}

export async function ensureUser(userExternalId: string): Promise<void> {
  await aiChatFetch("/users/ensure", {
    method: "POST",
    body: JSON.stringify({ externalId: userExternalId }),
  });
}

export async function listConversations(
  userExternalId: string,
): Promise<AiChatConversationSummary[]> {
  const data = await aiChatFetch<{ conversations: AiChatConversationSummary[] }>(
    `/conversations?userExternalId=${encodeURIComponent(userExternalId)}`,
  );
  return data?.conversations ?? [];
}

export async function createConversation(userExternalId: string): Promise<string> {
  const data = await aiChatFetch<{ conversation: { id: string } }>("/conversations", {
    method: "POST",
    body: JSON.stringify({
      type: "personal",
      participants: [{ userExternalId }],
    }),
  });
  if (!data) throw new Error("Failed to create conversation");
  return data.conversation.id;
}

export async function fetchMessages(conversationId: string): Promise<AiChatMessage[]> {
  const data = await aiChatFetch<{ messages: RawMessage[] }>(
    `/conversations/${conversationId}/messages`,
  );
  const messages = data?.messages ?? [];
  return messages.map((m) => ({
    id: m.id,
    text: m.content?.text ?? "",
    sender: m.author?.type === "business" ? "ai" : "user",
    createdAt: m.received,
  }));
}

export async function sendMessage(
  conversationId: string,
  userExternalId: string,
  message: string,
): Promise<void> {
  await aiChatFetch(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      author: { type: "user", userExternalId },
      content: { type: "text", text: message },
    }),
  });
}

const WS_URL =
  process.env.NEXT_PUBLIC_AI_CHAT_WS_URL;

interface RawIncomingMessage {
  message: { id: string; body: string };
}

export function subscribeToIncomingMessages(
  conversationId: string,
  onMessage: (message: AiChatMessage) => void,
): () => void {
  const ws = new WebSocket(`${WS_URL}?conversationId=${conversationId}`);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as RawIncomingMessage;
      onMessage({
        id: data.message.id,
        text: data.message.body,
        sender: "ai",
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("AiChat websocket parse error", e);
    }
  };
  return () => ws.close();
}
