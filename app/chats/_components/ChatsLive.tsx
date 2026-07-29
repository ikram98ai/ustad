"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSocket } from "../socket";

// Invisible helper: re-renders the server-rendered chat list whenever a
// message lands in any of the current user's chats.
const ChatsLive = () => {
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    const refresh = () => router.refresh();
    socket.on("chats:updated", refresh);
    return () => {
      socket.off("chats:updated", refresh);
    };
  }, [router]);

  return null;
};

export default ChatsLive;
