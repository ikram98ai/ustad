"use client";
import { getSocket } from "@/app/chats/socket";
import { Skeleton } from "@/app/components";
import { Notification } from "@/prisma/models";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import classnames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBell, FaClipboardList, FaRegCommentDots } from "react-icons/fa";

const typeIcons = {
  MESSAGE: <FaRegCommentDots size={18} />,
  ORDER: <FaClipboardList size={18} />,
  SYSTEM: <FaBell size={18} />,
};

const formatWhen = (at: string | Date) => {
  const date = new Date(at);
  const isToday = new Date().toDateString() === date.toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString();
};

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  // Snapshot of which notifications were unread when the page opened, so the
  // highlight survives the mark-all-read below.
  const [freshIds, setFreshIds] = useState<Set<string>>();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axios
        .get<{ notifications: Notification[]; unread: number }>(
          "/api/notifications"
        )
        .then((res) => res.data),
  });

  useEffect(() => {
    if (!data || freshIds) return;
    // Intentional one-time snapshot of the unread ids from the first fetch,
    // so the "new" highlight survives the mark-all-read call below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFreshIds(
      new Set(data.notifications.filter((n) => !n.is_read).map((n) => n.id))
    );
    if (data.unread > 0)
      axios.patch("/api/notifications").then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
  }, [data, freshIds, queryClient]);

  useEffect(() => {
    const socket = getSocket();
    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    socket.on("notification:new", invalidate);
    return () => {
      socket.off("notification:new", invalidate);
    };
  }, [queryClient]);

  return (
    <Flex direction="column" gap="3" className="max-w-3xl mx-auto">
      <Heading>Notifications</Heading>
      {isLoading &&
        [1, 2, 3, 4, 5].map((n) => (
          <Card key={n}>
            <Skeleton width="12rem" />
            <Skeleton />
          </Card>
        ))}
      {data?.notifications.length === 0 && (
        <Text color="gray">Nothing here yet — you are all caught up.</Text>
      )}
      {data?.notifications.map((notification) => {
        const inner = (
          <Flex gap="3" align="center">
            <Text color="violet">{typeIcons[notification.type]}</Text>
            <Flex direction="column" className="min-w-0 flex-1">
              <Flex justify="between" align="center">
                <Text
                  size="2"
                  weight={
                    freshIds?.has(notification.id) ? "bold" : "regular"
                  }
                >
                  {notification.title}
                </Text>
                <Text size="1" color="gray">
                  {formatWhen(notification.at)}
                </Text>
              </Flex>
              <Text size="1" color="gray" className="truncate">
                {notification.body}
              </Text>
            </Flex>
          </Flex>
        );
        return (
          <Card
            key={notification.id}
            className={classnames({
              "border-l-4 border-l-violet-500": freshIds?.has(notification.id),
            })}
          >
            {notification.link ? (
              <Link href={notification.link}>{inner}</Link>
            ) : (
              inner
            )}
          </Card>
        );
      })}
    </Flex>
  );
};

export default NotificationsPage;

export const dynamic = "force-dynamic";
