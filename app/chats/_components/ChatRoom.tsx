"use client";
import { Avatar } from "@radix-ui/themes";
import cn from "classnames";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";
import { getSocket } from "../socket";
import { ChatMessage, ChatUser } from "../types";

interface Props {
  chatId: string;
  currentUserId: string;
  otherUser: ChatUser;
  initialMessages: ChatMessage[];
}

interface SendAck {
  ok: boolean;
  message?: ChatMessage;
  error?: string;
}

const formatTime = (at: string | Date) =>
  new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const dayLabel = (at: string | Date) => {
  const date = new Date(at);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year:
      date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
};

const ChatRoom = ({
  chatId,
  currentUserId,
  otherUser,
  initialMessages,
}: Props) => {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [isConnected, setConnected] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [isTyping, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const appendMessage = useCallback(
    (message: ChatMessage) =>
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      ),
    []
  );

  useEffect(() => {
    const socket = getSocket();

    const join = () => {
      setConnected(true);
      socket.emit(
        "chat:join",
        chatId,
        (res: { ok: boolean; online?: boolean }) => {
          if (res?.ok) setOnline(!!res.online);
        }
      );
    };
    const onDisconnect = () => setConnected(false);
    const onMessage = (message: ChatMessage) => {
      if (message.chatId === chatId) appendMessage(message);
    };
    const onTyping = (payload: { userId: string; isTyping: boolean }) => {
      if (payload.userId === otherUser.id) setTyping(payload.isTyping);
    };
    const onPresence = (payload: { userId: string; online: boolean }) => {
      if (payload.userId !== otherUser.id) return;
      setOnline(payload.online);
      if (!payload.online) setTyping(false);
    };

    socket.on("connect", join);
    socket.on("disconnect", onDisconnect);
    socket.on("message:new", onMessage);
    socket.on("chat:typing", onTyping);
    socket.on("presence:update", onPresence);
    if (socket.connected) join();

    return () => {
      socket.emit("chat:leave", chatId);
      socket.off("connect", join);
      socket.off("disconnect", onDisconnect);
      socket.off("message:new", onMessage);
      socket.off("chat:typing", onTyping);
      socket.off("presence:update", onPresence);
    };
  }, [chatId, otherUser.id, appendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  const emitTyping = () => {
    const socket = getSocket();
    socket.emit("chat:typing", { chatId, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => socket.emit("chat:typing", { chatId, isTyping: false }),
      1500
    );
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    const messageText = text.trim();
    if (!messageText || !isConnected) return;

    const socket = getSocket();
    clearTimeout(typingTimeoutRef.current);
    socket.emit("chat:typing", { chatId, isTyping: false });
    socket.emit(
      "message:send",
      { chatId, text: messageText },
      (res: SendAck) => {
        if (res?.ok && res.message) appendMessage(res.message);
        else toast.error(res?.error || "Could not send the message.");
      }
    );
    setText("");
  };

  const statusText = !isConnected
    ? "Connecting…"
    : isTyping
    ? "Typing…"
    : isOnline
    ? "Online"
    : "Offline";

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-3">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2.5">
        <Link
          href="/chats"
          aria-label="Back to chats"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-ink"
        >
          <FaArrowLeft size={14} />
        </Link>
        <div className="relative shrink-0">
          <Avatar
            src={otherUser.image ?? undefined}
            fallback={otherUser.name?.[0] ?? "?"}
            size="3"
            radius="full"
            referrerPolicy="no-referrer"
          />
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
              isOnline ? "bg-green-500" : "bg-gray-300"
            )}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">
            {otherUser.name ?? "Ustad user"}
          </p>
          <p
            className={cn(
              "text-xs",
              isTyping
                ? "font-medium text-ink"
                : isOnline
                ? "text-green-600"
                : "text-gray-400"
            )}
          >
            {statusText}
          </p>
        </div>
      </div>

      {/* Thread */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <span className="text-3xl">👋</span>
            <p className="font-semibold">Say salam to start</p>
            <p className="max-w-xs text-sm text-gray-500">
              Introduce yourself and describe the job — rates and details are
              easier to agree on in chat.
            </p>
          </div>
        )}
        {messages.map((message, index) => {
          const isMine = message.senderId === currentUserId;
          const showDay =
            index === 0 ||
            dayLabel(messages[index - 1].at) !== dayLabel(message.at);
          return (
            <div key={message.id}>
              {showDay && (
                <div className="my-4 flex items-center gap-3 first:mt-0">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs font-medium text-gray-400">
                    {dayLabel(message.at)}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
              )}
              <div className={cn("chat", isMine ? "chat-end" : "chat-start")}>
                <div
                  className={cn(
                    "chat-bubble text-[15px]",
                    isMine
                      ? "bg-ink text-white"
                      : "border border-gray-200 bg-white text-ink"
                  )}
                >
                  {message.text}
                </div>
                <div className="chat-footer">
                  <time className="text-[11px] text-gray-400">
                    {formatTime(message.at)}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble border border-gray-200 bg-white text-ink">
              <span className="loading loading-dots loading-sm" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form onSubmit={sendMessage} className="flex shrink-0 items-center gap-2">
        <div className="flex h-11 flex-1 items-center rounded-full bg-gray-100 px-4 transition focus-within:ring-2 focus-within:ring-ink">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              emitTyping();
            }}
            placeholder={
              isConnected ? "Type a message…" : "Connecting…"
            }
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-gray-500"
          />
        </div>
        <button
          type="submit"
          aria-label="Send message"
          disabled={!isConnected || !text.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-ink-soft disabled:opacity-35"
        >
          <FaPaperPlane size={15} className="-translate-x-px" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
