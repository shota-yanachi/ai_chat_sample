export function AiChatRemainingBadge({ remainingCount }: { remainingCount: number }) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      残り{remainingCount}回送信できます
    </span>
  );
}
