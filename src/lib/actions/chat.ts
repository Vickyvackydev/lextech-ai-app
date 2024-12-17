///home/josephhenry/Downloads/project/legal assitant/src/lib/actions/chat.ts:

"use server";

import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { processFirstMessage } from "@/utils/chat-processing";
import prisma from "@/utils/connect";
import { revalidatePath } from "next/cache";

export async function createChat() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const chat = await prisma.chat.create({
    data: {
      title: "New Chat",
      userId: session.user.id,
      summary: "",
    },
    include: {
      messages: true,
    },
  });

  revalidatePath("/chat");
  return chat;
}

export async function updateChatMetadata(
  chatId: string,
  title: string,
  summary: string
) {
  try {
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        title: title.substring(0, 100), // Limit title length
        summary:
          typeof summary === "string" ? summary : JSON.stringify(summary),
      },
    });

    revalidatePath(`/chat/${chatId}`);
    return updatedChat;
  } catch (error) {
    console.error("Error updating chat metadata:", error);
    throw error;
  }
}

export async function addMessage(
  chatId: string,
  content: string,
  role: "USER" | "ASSISTANT",
  fileIds?: string[]
) {
  try {
    const message = await prisma.message.create({
      data: {
        content,
        role,
        chatId,
        fileIds: fileIds || [],
      },
    });

    // Update chat's lastMessageAt
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
    });

    revalidatePath(`/chat/${chatId}`);
    return message;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

export async function deleteFile(fileId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const file = await prisma.file.delete({
      where: {
        id: fileId,
        userId: session.user.id, // Ensure user owns the file
      },
    });

    // You might want to also delete the file from Vercel Blob
    // This would require implementing a delete method using the Vercel Blob API

    return file;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function deleteChatById(chatId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Delete messages first
    await prisma.message.deleteMany({
      where: { chatId },
    });

    // Delete the chat
    const deletedChat = await prisma.chat.delete({
      where: {
        id: chatId,
        userId: session.user.id,
      },
    });

    // Only revalidate the chats list path, not the entire chat path
    revalidatePath("/api/history");

    return { success: true, deletedChat };
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}
export async function deleteChats(chatIds: string[] | string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const idsToDelete = Array.isArray(chatIds) ? chatIds : [chatIds];

    await prisma.message.deleteMany({
      where: {
        chatId: { in: idsToDelete },
      },
    });

    const deletedChats = await prisma.chat.deleteMany({
      where: {
        id: { in: idsToDelete },
        userId: session.user.id,
      },
    });

    revalidatePath("/api/history");

    return { success: true, deletedChats };
  } catch (error) {
    console.error("Error deleting chats:", error);
    throw error;
  }
}

export async function shareChat(chatId: string, platform: string) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    throw new Error(`Chat with ID ${chatId} not found`);
  }

  const shareUrls = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/chat/${chatId}`
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${process.env.NEXT_PUBLIC_APP_URL}/chat/${chatId}`
    )}`,
  };

  const shareUrl = shareUrls[platform as keyof typeof shareUrls];
  if (!shareUrl) {
    throw new Error(`Share platform ${platform} is not supported`);
  }

  return shareUrl;
}

export async function getChatById(chatId: string) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });
    console.log("chatbyid", chat);
    return chat;
  } catch (error) {
    console.error("Error getting chat:", error);
    throw error;
  }
}

export async function saveChat({
  messages,
  userId,
  chatId,
}: {
  messages: any[];
  userId: string;
  chatId: string;
}) {
  try {
    // Get existing messages for this chat
    const existingMessages = await prisma.message.findMany({
      where: { chatId },
      select: { content: true, role: true },
    });

    // Filter out messages that already exist in the database
    const newMessages = messages.filter((message) => {
      const messageContent = Array.isArray(message.content)
        ? message.content.find((item: any) => item.type === "text")?.text || ""
        : typeof message.content === "object" && message.content.text
        ? message.content.text
        : (message.content as string);

      return !existingMessages.some(
        (existing) =>
          existing.content === messageContent &&
          existing.role === message.role.toUpperCase()
      );
    });

    // Save only new messages in sequence
    for (const message of newMessages) {
      const content = Array.isArray(message.content)
        ? message.content.find((item: any) => item.type === "text")?.text || ""
        : typeof message.content === "object" && message.content.text
        ? message.content.text
        : (message.content as string);

      await addMessage(
        chatId,
        content,
        message.role.toUpperCase() as "USER" | "ASSISTANT"
      );
    }

    // Update chat's lastMessageAt
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
      include: { messages: true },
    });

    return updatedChat;
  } catch (error) {
    console.error("Failed to save chat in database", error);
    throw error;
  }
}

export async function getChatByUserId(userId: string) {
  const chats = await prisma.chat.findMany({
    where: { userId },
    orderBy: { lastMessageAt: "desc" },
  });
  console.log("chatbyuserid", chats);
  return chats;
}

export async function getFilesByUserId(userId: string) {
  try {
    const files = await prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        chat: {
          select: {
            title: true,
          },
        },
      },
    });
    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}

export async function getMessagesByChatId(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

export async function deleteUploadedFile(fileId: string) {
  await prisma.file.delete({
    where: { id: fileId },
  });
}
