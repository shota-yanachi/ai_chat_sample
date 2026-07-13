"use client";

import { useAiChatController } from "@/features/ai-chat/presentation/useAiChatController";
import { AiChatMessageList } from "@/features/ai-chat/presentation/components/AiChatMessageList";
import { AiChatInputBar } from "@/features/ai-chat/presentation/components/AiChatInputBar";
import { AiChatRemainingBadge } from "@/features/ai-chat/presentation/components/AiChatRemainingBadge";

export default function AiChatPage() {
  const { status, state, error, sendMessage } = useAiChatController();

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-zinc-500">読み込み中...</p>
      </div>
    );
  }

  if (status === "error" || !state) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm text-red-600">{error ?? "エラーが発生しました"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h1 className="text-base font-semibold">AIチャット</h1>
        <AiChatRemainingBadge remainingCount={state.remainingCount} />
      </header>
      <AiChatMessageList messages={state.messages} />
      <AiChatInputBar
        disabled={state.isSending || state.remainingCount <= 0}
        onSend={sendMessage}
      />
    </div>
  );
}
