// `at` is a Date when it comes from a server component and an ISO string
// when it arrives over the socket.
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  at: string | Date;
}

export interface ChatUser {
  id: string;
  name: string | null;
  image: string | null;
}
