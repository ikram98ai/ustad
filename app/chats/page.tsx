"use client";
import { Chat } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatsPage = () => {
  const session = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  let socket = io("http://localhost:3001");

  useEffect(() => {
    socket.emit("loadChats", session.data?.user.id);
  }, []);

  useEffect(() => {
    socket.on("reciveChats", (chats: Chat[]) => setChats(chats));
  }, [socket]);

  return (
    <ul>
      {chats.map((chat) => (
        <li key={chat.id}>
          <Link href={"/chats/" + chat.id}>{chat.senderId}</Link>
        </li>
      ))}
    </ul>
  );
};
export default ChatsPage;
