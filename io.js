const prisma = require("@/prisma/client");
const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket);
  socket.on("loadChats", async (userId) => {
    const chats = await prisma.chat.findMany({
      where: { OR: [{ receiverId: userId }, { senderId: userId }] },
    });
    socket.emit("reciveChats", chats);
  });
  socket.on("join_room", (chatId) => {
    socket.join(chatId);
    console.log(`user with joined room - ${chatId}`);
  });

  socket.on("send_msg", async (text, senderId, receiverId, chatId) => {
    let chat;
    if (chatId === "new")
      chat = await prisma.chat.create({
        data: { senderId, receiverId: receiverId },
      });

    const message = await prisma.message.create({
      data: { chatId: chat ? chat.id : chatId, senderId, text },
    });

    //This will send a message to a specific room ID
    socket.to(chatId).emit("receive_msg", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
