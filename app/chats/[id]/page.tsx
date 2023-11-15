"use client";
import React, { useEffect, useState } from "react";
import { Message } from "@prisma/client";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { Flex } from "@radix-ui/themes";

const ChatPage = ({ params }: { params: { id: string } }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const session = useSession();

  let socket = io("http://localhost:3001");

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: Message = {
        id: params.id,
        senderId: session.data?.user.id,
        text: currentMsg,
        at: new Date(Date.now()),
      };
      await socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.emit("join_room", params.id);
  }, []);

  useEffect(() => {
    socket.on("receive_msg", (data: Message) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  return (
    <Flex direction="column" gap="3">
      <p>
        Room Id: <b>{params.id}</b>
      </p>
      <div>
        {chat.map((chat) => (
          <div key={chat.id}>
            <span>{chat.senderId}</span>
            <h3>{chat.text}</h3>
          </div>
        ))}
      </div>
      <form className="" onSubmit={(e) => sendData(e)}>
        <input
          type="text"
          value={currentMsg}
          placeholder="Type your message.."
          onChange={(e) => setCurrentMsg(e.target.value)}
        />
        <button>Send</button>
      </form>
    </Flex>
  );
};

export default ChatPage;
