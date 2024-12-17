///home/josephhenry/Downloads/project/legal assitant/src/app/api/upload-pdf/route.ts
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/utils/connect";

const FileSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size should be less than 5MB",
  }),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const chatId = formData.get("chatId") as string | null;

      if (!file || !chatId) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const validatedFile = FileSchema.safeParse({ file });

      if (!validatedFile.success) {
        const errorMessage = validatedFile.error.errors
          .map((error) => error.message)
          .join(", ");

        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }

      // Upload to Vercel Blob
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true, // Add random suffix to prevent naming conflicts
      });

      if (blob) {
        console.log("file uploaded to vercel");
      } else {
        console.log("failed to upload file");
      }

      // Save file metadata to database
      const savedFile = await prisma.file.create({
        data: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: blob.url,
          userId: session.user.id,
          chatId: chatId || undefined,
        },
      });

      return NextResponse.json(savedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
