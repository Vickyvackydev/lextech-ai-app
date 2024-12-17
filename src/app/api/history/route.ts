///home/josephhenry/Downloads/project/legal assitant/src/app/api/history/route.ts
import { auth } from "@/app/api/auth/[...nextauth]/auth"
import prisma from "@/utils/connect"
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getChatByUserId } from "@/lib/actions/chat"


export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user || !session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const chats = await getChatByUserId(session.user.id as string)
  if (!chats || chats.length === 0) {
    return NextResponse.json({ message: "No chat history found" }, { status: 404 })
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');
  revalidatePath(`/chat/${chatId}`);
  console.log("chats", chats)
  return NextResponse.json(chats)
}