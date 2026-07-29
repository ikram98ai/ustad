"use client";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import classnames from "classnames";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <Flex direction="column" gap="3" className="max-w-3xl mx-auto">
      <Card>
        <Flex align="center" gap="3">
          <Avatar
            src={otherUser.image ?? undefined}
            fallback={otherUser.name?.[0] ?? "?"}
            size="3"
            radius="full"
            referrerPolicy="no-referrer"
          />
          <Box>
            <Heading size="3">{otherUser.name ?? "Ustad user"}</Heading>
            <Text size="1" color={isOnline ? "green" : "gray"}>
              {!isConnected
                ? "Connecting..."
                : isTyping
                ? "Typing..."
                : isOnline
                ? "Online"
                : "Offline"}
            </Text>
          </Box>
        </Flex>
      </Card>

      <div className="h-[60vh] overflow-y-auto rounded-lg border p-3">
        {messages.length === 0 && (
          <Flex justify="center" mt="9">
            <Text color="gray">Say salam to start the conversation.</Text>
          </Flex>
        )}
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={classnames("chat", isMine ? "chat-end" : "chat-start")}
            >
              <div
                className={classnames("chat-bubble", {
                  "chat-bubble-primary": isMine,
                })}
              >
                {message.text}
              </div>
              <div className="chat-footer opacity-50">
                <time className="text-xs">{formatTime(message.at)}</time>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble">
              <span className="loading loading-dots loading-sm" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage}>
        <Flex gap="2">
          <Box flexGrow="1">
            <TextField.Root
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                emitTyping();
              }}
            />
          </Box>
          <Button type="submit" disabled={!isConnected || !text.trim()}>
            Send
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

export default ChatRoom;
