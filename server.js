const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const { decode } = require("next-auth/jwt");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const prisma = new PrismaClient();

const MAX_MESSAGE_LENGTH = 5000;

const parseCookies = (header = "") =>
  header.split(";").reduce((cookies, part) => {
    const index = part.indexOf("=");
    if (index === -1) return cookies;
    cookies[part.slice(0, index).trim()] = decodeURIComponent(
      part.slice(index + 1).trim()
    );
    return cookies;
  }, {});

const userRoom = (userId) => `user:${userId}`;
const chatRoom = (chatId) => `chat:${chatId}`;

const isParticipant = (chat, userId) =>
  chat.senderId === userId || chat.receiverId === userId;

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

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
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token?.id) return next(new Error("Unauthorized"));

      socket.data.userId = token.id;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    const wasOffline = !io.sockets.adapter.rooms.has(userRoom(userId));
    socket.join(userRoom(userId));
    if (wasOffline)
      socket.broadcast.emit("presence:update", { userId, online: true });

    socket.on("chat:join", async (chatId, ack) => {
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

    socket.on("message:send", async (payload, ack) => {
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
