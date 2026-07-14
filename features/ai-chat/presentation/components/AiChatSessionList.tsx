import type { AiChatConversationSummary } from "../../domain/types";
import { formatTimestamp } from "../formatTimestamp";
import { AiChatAvatarIcon } from "./AiChatAvatarIcon";

interface AiChatSessionListProps {
  sessions: AiChatConversationSummary[];
  isCreating: boolean;
  isResetting: boolean;
  onSelect: (conversationId: string) => void;
  onStartNew: () => void;
  onReset: () => void;
}

export function AiChatSessionList({
  sessions,
  isCreating,
  isResetting,
  onSelect,
  onStartNew,
  onReset,
}: AiChatSessionListProps) {
  const handleReset = () => {
    if (window.confirm("トーク一覧をリセットしますか?この操作は元に戻せません。")) {
      onReset();
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDEDEB]">
          <AiChatAvatarIcon className="h-5 w-5" />
        </span>
        <h1 className="flex-1 text-base font-semibold">セッション一覧</h1>
        <button
          type="button"
          onClick={handleReset}
          disabled={isResetting}
          className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-950"
        >
          {isResetting ? "リセット中..." : "トーク一覧をリセット"}
        </button>
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
