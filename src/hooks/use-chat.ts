"use client";

import useSWR from "swr";
import { Chat, Message } from "@prisma/client";

interface ChatWithMessages extends Chat {
  messages: Message[];
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export function useLexChat(chatId?: string) {
  const {
    data: chat,
    error: chatError,
    mutate: mutateChat,
  } = useSWR<ChatWithMessages>(chatId ? `/api/chat/${chatId}` : null, fetcher);

  const {
    data: chats,
    error: chatsError,
    mutate: mutateChats,
  } = useSWR<ChatWithMessages[]>("/api/chats", fetcher);

  return {
    chat,
    chats,
    isLoading: !chatError && !chat,
    isError: chatError || chatsError,
    mutateChat,
    mutateChats,
  };
}
