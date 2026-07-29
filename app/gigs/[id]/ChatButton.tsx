"use client";
import { Spinner } from "@/app/components";
import { Chat } from "@/prisma/models";
import { Button } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ChatButton = ({
  receiverId,
  label = "Chat with Ustad",
}: {
  receiverId: string;
  label?: string;
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const startChat = async () => {
    try {
      setLoading(true);
      const { data: chat } = await axios.post<Chat>("/api/chats", {
        receiverId,
      });
      router.push(`/chats/${chat.id}`);
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Button
        variant="soft"
        highContrast
        onClick={startChat}
        disabled={isLoading}
      >
        {label} {isLoading && <Spinner />}
      </Button>
    </>
  );
};

export default ChatButton;
