import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { Avatar } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaComments } from "react-icons/fa6";
import ChatsLive from "./_components/ChatsLive";

const formatWhen = (at?: Date) => {
  if (!at) return "";
  const isToday = new Date().toDateString() === at.toDateString();
  return isToday
    ? at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : at.toLocaleDateString([], { day: "numeric", month: "short" });
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
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="mb-1">Chats</h1>
      <p className="mb-4 text-sm text-gray-500">
        {items.length === 0
          ? "Conversations with ustads and customers appear here."
          : `${items.length} conversation${items.length === 1 ? "" : "s"}`}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <FaComments size={36} className="text-gray-300" />
          <p className="font-semibold">No conversations yet</p>
          <p className="max-w-xs text-sm text-gray-500">
            Open a gig on the map and tap “Chat with Ustad” to start
            negotiating.
          </p>
          <Link
            href="/"
            className="mt-1 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            Explore ustads
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/chats/${item.id}`}
                className="flex items-center gap-3.5 px-4 py-3.5 transition hover:bg-gray-50"
              >
                <Avatar
                  src={item.otherUser.image ?? undefined}
                  fallback={item.otherUser.name?.[0] ?? "?"}
                  size="4"
                  radius="full"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-semibold">
                      {item.otherUser.name ?? "Ustad user"}
                    </p>
                    <time className="shrink-0 text-xs text-gray-400">
                      {formatWhen(item.lastMessage?.at)}
                    </time>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-gray-500">
                    {item.lastMessage
                      ? `${
                          item.lastMessage.senderId === userId ? "You: " : ""
                        }${item.lastMessage.text}`
                      : "No messages yet — say salam 👋"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <ChatsLive />
    </div>
  );
};

export const metadata = {
  title: "Chats",
  description: "Your conversations with ustads and customers",
};

export default ChatsPage;

export const dynamic = "force-dynamic";
