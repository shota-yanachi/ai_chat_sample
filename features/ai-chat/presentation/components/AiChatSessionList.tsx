import type { AiChatConversationSummary } from "../../domain/types";
import { formatTimestamp } from "../formatTimestamp";
import { AiChatAvatarIcon } from "./AiChatAvatarIcon";

interface AiChatSessionListProps {
  sessions: AiChatConversationSummary[];
  isCreating: boolean;
  onSelect: (conversationId: string) => void;
  onStartNew: () => void;
}

export function AiChatSessionList({
  sessions,
  isCreating,
  onSelect,
  onStartNew,
}: AiChatSessionListProps) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDEDEB]">
          <AiChatAvatarIcon className="h-5 w-5" />
        </span>
        <h1 className="text-base font-semibold">セッション一覧</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <button
          type="button"
          onClick={onStartNew}
          disabled={isCreating}
          className="mb-4 w-full rounded-full bg-[#EF857D] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isCreating ? "作成中..." : "新しいセッションを始める"}
        </button>

        {sessions.length === 0 ? (
          <p className="text-sm text-zinc-500">まだセッションがありません</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => onSelect(session.id)}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-left text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  <p className="font-medium">セッション {session.id.slice(0, 8)}</p>
                  <p className="text-xs text-zinc-400">
                    最終更新: {formatTimestamp(session.lastUpdatedAt)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
