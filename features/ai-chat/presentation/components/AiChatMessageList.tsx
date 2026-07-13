import type { AiChatMessage } from "../../domain/types";

export function AiChatMessageList({ messages }: { messages: AiChatMessage[] }) {
  return (
    <ul className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <span
            className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
              message.sender === "user"
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
            }`}
          >
            {message.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
