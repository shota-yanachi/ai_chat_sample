"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOrCreateUserExternalId, resetUserExternalId } from "@/lib/user/userExternalId";
import * as usecase from "../usecase/aiChatUsecase";
import type { AiChatConversationSummary } from "../domain/types";

type Status = "loading" | "error" | "ready";

interface UseAiChatSessionList {
  status: Status;
  sessions: AiChatConversationSummary[];
  error: string | null;
  isCreating: boolean;
  isResetting: boolean;
  startNewSession: () => Promise<string | null>;
  resetSessions: () => Promise<void>;
}

export function useAiChatSessionList(): UseAiChatSessionList {
  const [status, setStatus] = useState<Status>("loading");
  const [sessions, setSessions] = useState<AiChatConversationSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      try {
        const userExternalId = getOrCreateUserExternalId();
        const result = await usecase.listSessions(userExternalId);
        setSessions(result);
        setStatus("ready");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
        setStatus("error");
      }
    })();
  }, []);

  const startNewSession = useCallback(async () => {
    setIsCreating(true);
    try {
      const userExternalId = getOrCreateUserExternalId();
      return await usecase.startNewSession(userExternalId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const resetSessions = useCallback(async () => {
    setIsResetting(true);
    try {
      const userExternalId = getOrCreateUserExternalId();
      await usecase.deleteUser(userExternalId);
      const newUserExternalId = resetUserExternalId();
      const result = await usecase.listSessions(newUserExternalId);
      setSessions(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsResetting(false);
    }
  }, []);

  return { status, sessions, error, isCreating, isResetting, startNewSession, resetSessions };
}
