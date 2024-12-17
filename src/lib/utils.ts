///home/josephhenry/Downloads/project/legal assitant/src/lib/utils.ts

import { Chat } from "@prisma/client";
import { Message as PrismaMessage } from "@prisma/client";
import { CoreToolMessage, Message, ToolInvocation } from "ai";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

export function convertToUIMessages(messages: PrismaMessage[]): Message[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role.toLowerCase() as "user" | "assistant",
    content: message.content,
    fileIds: message.fileIds || [],
    createdAt: message.createdAt,
    toolInvocations: [], // Preserve tool invocations array
  }));
}

export function getTitleFromChat(chat: Chat & { messages: PrismaMessage[] }) {
  if (!chat.messages || chat.messages.length === 0) {
    return "New Chat";
  }
  return chat.title || "New Chat";
}