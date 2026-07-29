import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });
  const userId = session.user.id;

  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { at: "desc" },
      take: 50,
    }),
    prisma.notification.count({ where: { userId, is_read: false } }),
  ]);

  return NextResponse.json({ notifications, unread });
}

// Marks all of the current user's notifications as read.
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId: session.user.id, is_read: false },
    data: { is_read: true },
  });

  return NextResponse.json({});
}
