"use client";

import { Suspense, useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AiChatScreen } from "@/features/ai-chat/presentation/components/AiChatScreen";
import { AiChatSessionList } from "@/features/ai-chat/presentation/components/AiChatSessionList";
import { useAiChatSessionList } from "@/features/ai-chat/presentation/useAiChatSessionList";
import {
  subscribeToGate,
  getGateSnapshot,
  getGateServerSnapshot,
} from "@/lib/user/aiChatGateStore";

function LoadingScreen() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-zinc-500">読み込み中...</p>
    </div>
  );
}

function AiChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const { status, sessions, error, isCreating, startNewSession } = useAiChatSessionList();

  if (conversationId) {
    return (
      <AiChatScreen
        conversationId={conversationId}
        onBack={() => router.push("/ai-chat")}
      />
    );
  }

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <p className="text-sm text-red-600">{error ?? "エラーが発生しました"}</p>
      </div>
    );
  }

  return (
    <AiChatSessionList
      sessions={sessions}
      isCreating={isCreating}
      onSelect={(id) => router.push(`/ai-chat?conversationId=${id}`)}
      onStartNew={async () => {
        const id = await startNewSession();
        if (id) router.push(`/ai-chat?conversationId=${id}`);
      }}
    />
  );
}

export default function AiChatPage() {
  const router = useRouter();
  const unlocked = useSyncExternalStore(subscribeToGate, getGateSnapshot, getGateServerSnapshot);

  useEffect(() => {
    if (!unlocked) {
      router.replace("/");
    }
  }, [unlocked, router]);

  if (!unlocked) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AiChatPageContent />
    </Suspense>
  );
}
