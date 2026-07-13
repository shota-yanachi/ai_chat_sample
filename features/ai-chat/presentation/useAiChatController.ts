"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOrCreateUserExternalId } from "@/lib/user/userExternalId";
import * as usecase from "../usecase/aiChatUsecase";
import type { AiChatMessage, AiChatState } from "../domain/types";

type Status = "loading" | "error" | "ready";

interface UseAiChatController {
  status: Status;
  state: AiChatState | null;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
}

export function useAiChatController(conversationId: string): UseAiChatController {
  const [status, setStatus] = useState<Status>("loading");
  const [state, setState] = useState<AiChatState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadedFor = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (loadedFor.current !== conversationId) {
      loadedFor.current = conversationId;
      setStatus("loading");
      setState(null);
      setError(null);

      (async () => {
        try {
          const userExternalId = getOrCreateUserExternalId();
          const result = await usecase.loadSession(conversationId, userExternalId);
          setState(result);
          setStatus("ready");

          unsubscribeRef.current = usecase.subscribeToIncomingMessages(
            conversationId,
            (message) => {
              setState((prev) =>
                prev ? { ...prev, messages: [...prev.messages, message] } : prev,
              );
            },
          );
        } catch (e) {
          setError(e instanceof Error ? e.message : "Unknown error");
          setStatus("error");
        }
      })();
    }

    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !state || state.isSending) return;

      const optimisticMessage: AiChatMessage = {
        id: crypto.randomUUID(),
        text: trimmed,
        sender: "user",
        createdAt: new Date().toISOString(),
      };

      setState((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, optimisticMessage],
              isSending: true,
            }
          : prev,
      );

      try {
        await usecase.sendMessage(state.conversationId, state.userExternalId, trimmed);
      } finally {
        setState((prev) => (prev ? { ...prev, isSending: false } : prev));
      }
    },
    [state],
  );

  return { status, state, error, sendMessage };
}
