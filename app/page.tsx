"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AiChatGate } from "@/features/ai-chat/presentation/components/AiChatGate";
import {
  subscribeToGate,
  getGateSnapshot,
  getGateServerSnapshot,
  unlockGate,
} from "@/lib/user/aiChatGateStore";

export default function Home() {
  const router = useRouter();
  const unlocked = useSyncExternalStore(subscribeToGate, getGateSnapshot, getGateServerSnapshot);

  useEffect(() => {
    if (unlocked) {
      router.replace("/ai-chat");
    }
  }, [unlocked, router]);

  const handleUnlock = () => {
    unlockGate();
    router.push("/ai-chat");
  };

  if (unlocked) {
    return null;
  }

  return <AiChatGate onUnlock={handleUnlock} />;
}
