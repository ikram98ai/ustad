import prisma from "@/prisma/client";
import { Notification, NotificationType } from "@prisma/client";
import type { Server } from "socket.io";

declare global {
  // Set by server.js — API routes share its process under the custom server.
  // eslint-disable-next-line no-var
  var io: Server | undefined;
}

interface NotifyInput {
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
}

// Persist a notification and push it live to the recipient's sockets.
// Persistence always succeeds independently of whether anyone is connected.
export async function notify(
  userId: string,
  { type, title, body, link }: NotifyInput
): Promise<Notification> {
  const notification = await prisma.notification.create({
    data: { userId, type, title, body, link },
  });
  globalThis.io?.to(`user:${userId}`).emit("notification:new", notification);
  return notification;
}
