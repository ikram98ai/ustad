import "dotenv/config";
import { createServer } from "node:http";
import next from "next";
import { decode } from "next-auth/jwt";
import { Server } from "socket.io";
import prisma from "./prisma/client";
import type { Chat, Message } from "./prisma/generated/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const MAX_MESSAGE_LENGTH = 5000;

const parseCookies = (header = ""): Record<string, string> =>
  header.split(";").reduce<Record<string, string>>((cookies, part) => {
    const index = part.indexOf("=");
    if (index === -1) return cookies;
    cookies[part.slice(0, index).trim()] = decodeURIComponent(
      part.slice(index + 1).trim()
    );
    return cookies;
  }, {});

const userRoom = (userId: string) => `user:${userId}`;
const chatRoom = (chatId: string) => `chat:${chatId}`;

const isParticipant = (chat: Chat, userId: string) =>
  chat.senderId === userId || chat.receiverId === userId;

// Persist a MESSAGE notification for a recipient who doesn't have the chat
// open. Consecutive unread messages from the same chat collapse into one
// notification that carries the latest text.
async function notifyMessage(io: Server, message: Message, recipientId: string) {
  const sockets = await io.in(chatRoom(message.chatId)).fetchSockets();
  if (sockets.some((s) => s.data.userId === recipientId)) return;

  const sender = await prisma.user.findUnique({
    where: { id: message.senderId },
    select: { name: true },
  });
  const link = `/chats/${message.chatId}`;
  const title = `New message from ${sender?.name ?? "an ustad user"}`;

  const existing = await prisma.notification.findFirst({
    where: { userId: recipientId, type: "MESSAGE", link, is_read: false },
  });
  const notification = existing
    ? await prisma.notification.update({
        where: { id: existing.id },
        data: { title, body: message.text, at: new Date() },
      })
    : await prisma.notification.create({
        data: {
          userId: recipientId,
          type: "MESSAGE",
          title,
          body: message.text,
          link,
        },
      });

  io.to(userRoom(recipientId)).emit("notification:new", notification);
}

interface JoinAck {
  ok: boolean;
  online?: boolean;
}

interface SendAck {
  ok: boolean;
  message?: Message;
  error?: string;
}

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  // API routes run in this same process (custom server), so they can push
  // real-time notifications through globalThis.io — see app/lib/notifications.ts.
  globalThis.io = io;

  // Session strategy is JWT, so the next-auth cookie can be verified here
  // without a database round-trip.
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const sessionToken =
        cookies["__Secure-next-auth.session-token"] ??
        cookies["next-auth.session-token"];
      if (!sessionToken) return next(new Error("Unauthorized"));

      const token = await decode({
        token: sessionToken,
        secret: process.env.NEXTAUTH_SECRET!,
      });
      if (!token?.id) return next(new Error("Unauthorized"));

      socket.data.userId = String(token.id);
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId: string = socket.data.userId;

    const wasOffline = !io.sockets.adapter.rooms.has(userRoom(userId));
    socket.join(userRoom(userId));
    if (wasOffline)
      socket.broadcast.emit("presence:update", { userId, online: true });

    socket.on("chat:join", async (chatId, ack?: (res: JoinAck) => void) => {
      try {
        const chat = await prisma.chat.findUnique({
          where: { id: String(chatId) },
        });
        if (!chat || !isParticipant(chat, userId)) return ack?.({ ok: false });

        socket.join(chatRoom(chat.id));
        const otherId =
          chat.senderId === userId ? chat.receiverId : chat.senderId;
        ack?.({
          ok: true,
          online: io.sockets.adapter.rooms.has(userRoom(otherId)),
        });
      } catch (error) {
        ack?.({ ok: false });
      }
    });

    socket.on("chat:leave", (chatId) => {
      socket.leave(chatRoom(String(chatId)));
    });

    socket.on("chat:typing", (payload) => {
      const chatId = String(payload?.chatId ?? "");
      if (!socket.rooms.has(chatRoom(chatId))) return;
      socket.to(chatRoom(chatId)).emit("chat:typing", {
        userId,
        isTyping: !!payload?.isTyping,
      });
    });

    socket.on("message:send", async (payload, ack?: (res: SendAck) => void) => {
      try {
        const chatId = String(payload?.chatId ?? "");
        const text = String(payload?.text ?? "").trim();
        if (!chatId || !text || text.length > MAX_MESSAGE_LENGTH)
          return ack?.({ ok: false, error: "Invalid message." });

        const chat = await prisma.chat.findUnique({ where: { id: chatId } });
        if (!chat || !isParticipant(chat, userId))
          return ack?.({ ok: false, error: "Chat not found." });

        const message = await prisma.message.create({
          data: { chatId, senderId: userId, text },
        });

        // The sender gets the message back through the ack; everyone else in
        // the room gets it here. User rooms drive the chat-list refresh.
        socket.to(chatRoom(chatId)).emit("message:new", message);
        io.to(userRoom(chat.senderId))
          .to(userRoom(chat.receiverId))
          .emit("chats:updated", { chatId });
        ack?.({ ok: true, message });

        const recipientId =
          chat.senderId === userId ? chat.receiverId : chat.senderId;
        notifyMessage(io, message, recipientId).catch(() => {});
      } catch (error) {
        ack?.({ ok: false, error: "Could not send the message." });
      }
    });

    socket.on("disconnect", () => {
      if (!io.sockets.adapter.rooms.has(userRoom(userId)))
        socket.broadcast.emit("presence:update", { userId, online: false });
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
