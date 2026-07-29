import { io, Socket } from "socket.io-client";

let socket: Socket | undefined;

// Single shared connection to the app's own origin — server.js attaches
// Socket.IO to the same HTTP server that serves Next.
export const getSocket = (): Socket => {
  if (!socket) socket = io();
  return socket;
};
