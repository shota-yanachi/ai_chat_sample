"use client";

import { useState } from "react";

const PASSPHRASE = "miruto";

interface AiChatGateProps {
  onUnlock: () => void;
}

export function AiChatGate({ onUnlock }: AiChatGateProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSPHRASE) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        合言葉を入力してチャットを始めてください
      </p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="合言葉"
          autoFocus
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none dark:border-zinc-700 dark:bg-zinc-900"
        />
        {error && <p className="text-xs text-red-600">合言葉が違います</p>}
        <button
          type="submit"
          className="rounded-full bg-[#EF857D] px-4 py-2 text-sm font-medium text-white"
        >
          チャットを始める
        </button>
      </form>
    </div>
  );
}
