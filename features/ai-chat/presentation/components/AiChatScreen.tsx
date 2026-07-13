"use client";

import { useAiChatController } from "../useAiChatController";
import { AiChatMessageList } from "./AiChatMessageList";
import { AiChatInputBar } from "./AiChatInputBar";
import { AiChatAvatarIcon } from "./AiChatAvatarIcon";

interface AiChatScreenProps {
  conversationId: string;
  onBack: () => void;
}

export function AiChatScreen({ conversationId, onBack }: AiChatScreenProps) {
  const { status, state, error, sendMessage } = useAiChatController(conversationId);

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
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          ← 一覧
        </button>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDEDEB]">
          <AiChatAvatarIcon className="h-5 w-5" />
        </span>
        <h1 className="text-base font-semibold">miruto AIサポーター</h1>
      </header>
      <AiChatMessageList messages={state.messages} />
      <AiChatInputBar disabled={state.isSending} onSend={sendMessage} />
    </div>
  );
}
