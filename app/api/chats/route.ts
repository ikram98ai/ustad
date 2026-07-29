import authOptions from "@/app/auth/authOptions";
import { chatSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = chatSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.issues, { status: 400 });

  const userId = session.user.id;
  const { receiverId } = validation.data;

  if (receiverId === userId)
    return NextResponse.json(
      { error: "You cannot chat with yourself." },
      { status: 400 }
    );

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver)
    return NextResponse.json({ error: "Invalid user" }, { status: 404 });

  const existingChat = await prisma.chat.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    },
  });
  if (existingChat) return NextResponse.json(existingChat);

  const newChat = await prisma.chat.create({
    data: { senderId: userId, receiverId },
  });
  return NextResponse.json(newChat, { status: 201 });
}
