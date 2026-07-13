"use client";

import { useState } from "react";

interface AiChatInputBarProps {
  disabled: boolean;
  onSend: (text: string) => void;
}

export function AiChatInputBar({ disabled, onSend }: AiChatInputBarProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-2 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="メッセージを入力"
        className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        送信
      </button>
    </form>
  );
}
