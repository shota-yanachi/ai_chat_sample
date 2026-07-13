export type AiChatMessageSender = "user" | "ai";

export interface AiChatMessage {
  id: string;
  text: string;
  sender: AiChatMessageSender;
  createdAt: string; // ISO8601
}

export interface AiChatConversationSummary {
  id: string;
  lastUpdatedAt: string; // ISO8601
}

export interface AiChatState {
  conversationId: string;
  userExternalId: string;
  messages: AiChatMessage[];
  remainingCount: number;
  isSending: boolean;
}
