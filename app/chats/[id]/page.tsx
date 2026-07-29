import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import ChatRoom from "../_components/ChatRoom";

interface Props {
  params: Promise<{ id: string }>;
}

const ChatDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const userId = session.user.id;

  const { id } = await params;
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
  });
  if (!chat || (chat.senderId !== userId && chat.receiverId !== userId))
    notFound();

  const messages = await prisma.message.findMany({
    where: { chatId: chat.id },
    orderBy: { at: "asc" },
  });

  const otherUser = chat.senderId === userId ? chat.receiver : chat.sender;

  return (
    <ChatRoom
      chatId={chat.id}
      currentUserId={userId}
      otherUser={otherUser}
      initialMessages={messages}
    />
  );
};

export const metadata = {
  title: "Chat",
  description: "Live conversation",
};

export default ChatDetailPage;
