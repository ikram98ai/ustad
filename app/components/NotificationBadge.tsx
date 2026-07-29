"use client";
import { getSocket } from "@/app/chats/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { FaBell } from "react-icons/fa";

const NotificationBadge = () => {
  const { status } = useSession();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      axios
        .get<{ unread: number }>("/api/notifications")
        .then((res) => res.data),
    enabled: status === "authenticated",
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    const socket = getSocket();
    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    socket.on("notification:new", invalidate);
    return () => {
      socket.off("notification:new", invalidate);
    };
  }, [status, queryClient]);

  const unread = data?.unread ?? 0;

  return (
    <span className="indicator">
      <FaBell size={18} />
      {unread > 0 && (
        <span className="badge badge-primary badge-xs indicator-item">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </span>
  );
};

export default NotificationBadge;
