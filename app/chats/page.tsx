import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ChatsLive from "./_components/ChatsLive";

const formatWhen = (at?: Date) => {
  if (!at) return "";
  const isToday = new Date().toDateString() === at.toDateString();
  return isToday
    ? at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : at.toLocaleDateString();
};

const ChatsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session.user.id;

  const chats = await prisma.chat.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
      messages: { orderBy: { at: "desc" }, take: 1 },
    },
  });

  const items = chats
    .map((chat) => ({
      id: chat.id,
      otherUser: chat.senderId === userId ? chat.receiver : chat.sender,
      lastMessage: chat.messages[0],
    }))
    .sort(
      (a, b) =>
        (b.lastMessage?.at.getTime() ?? 0) - (a.lastMessage?.at.getTime() ?? 0)
    );

  return (
    <Flex direction="column" gap="3" className="max-w-3xl mx-auto">
      <Heading>Chats</Heading>
      {items.length === 0 && (
        <Text color="gray">
          No conversations yet. Open a gig and start chatting with its ustad.
        </Text>
      )}
      {items.map((item) => (
        <Card key={item.id}>
          <Link href={`/chats/${item.id}`}>
            <Flex align="center" gap="3">
              <Avatar
                src={item.otherUser.image ?? undefined}
                fallback={item.otherUser.name?.[0] ?? "?"}
                size="3"
                radius="full"
                referrerPolicy="no-referrer"
              />
              <Box className="min-w-0 flex-1">
                <Flex justify="between" align="center">
                  <Text as="div" size="2" weight="bold">
                    {item.otherUser.name ?? "Ustad user"}
                  </Text>
                  <Text size="1" color="gray">
                    {formatWhen(item.lastMessage?.at)}
                  </Text>
                </Flex>
                <Text as="p" size="1" color="gray" className="truncate">
                  {item.lastMessage?.text ?? "No messages yet"}
                </Text>
              </Box>
            </Flex>
          </Link>
        </Card>
      ))}
      <ChatsLive />
    </Flex>
  );
};

export const metadata = {
  title: "Chats",
  description: "Your conversations with ustads and customers",
};

export default ChatsPage;
