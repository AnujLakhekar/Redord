import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (!socket && userId) {
    socket = io("http://localhost:4000", {
      query: { user: userId },
      transports: ["websocket"],
    });

    console.log("✅ Socket initialized");
  }
  return socket;
};

export const getSocket = () => socket;
