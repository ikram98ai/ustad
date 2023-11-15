"use client";
import React, { useEffect, useState } from "react";
import { Chat, Message } from "@prisma/client";
import { io } from "socket.io-client";
import { Flex } from "@radix-ui/themes";
import axios from "axios";

const ChatPage = ({ params }: { params: { id: string } }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [currentChat, setCurrentChat] = useState<Chat>();
  const [chat, setChat] = useState<Message[]>([]);

  let socket = io("http://localhost:3001");

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      await socket.emit(
        "send_msg",
        currentMsg,
        currentChat?.senderId,
        currentChat?.receiverId,
        params.id
      );
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.emit("join_room", params.id);
    axios
      .get<Chat>("api/chats/" + params.id)
      .then((res) => setCurrentChat(res.data));
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
