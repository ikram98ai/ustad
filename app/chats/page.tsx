import prisma from "@/prisma/client";
import Link from "next/link";

const ChatsPage = async () => {
  const chats = await prisma.chat.findMany();

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
