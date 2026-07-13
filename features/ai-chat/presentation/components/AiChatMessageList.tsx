import type { AiChatMessage } from "../../domain/types";
import { formatTimestamp } from "../formatTimestamp";
import { AiChatAvatarIcon } from "./AiChatAvatarIcon";

export function AiChatMessageList({ messages }: { messages: AiChatMessage[] }) {
  return (
    <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
      {messages.map((message) => (
        <li key={message.id} className="flex flex-col gap-1">
          {message.sender === "ai" && (
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FDEDEB]">
                <AiChatAvatarIcon className="h-5 w-5" />
              </span>
              <span className="text-sm text-zinc-500">miruto AIサポーター</span>
            </div>
          )}
          <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[75%] whitespace-pre-wrap rounded-2xl border px-4 py-3 text-sm leading-relaxed text-zinc-900 dark:text-zinc-50 ${
                message.sender === "user" ? "border-[#EF857D]" : "border-zinc-400"
              }`}
            >
              {message.text}
            </span>
          </div>
          <span
            className={`text-xs text-zinc-400 ${message.sender === "user" ? "text-right" : "pl-11"}`}
          >
            {formatTimestamp(message.createdAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
