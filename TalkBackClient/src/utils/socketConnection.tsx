import { io } from "socket.io-client";
export const onlineUsersSocket = io(
  `${import.meta.env.VITE_ONLINE_USERS_SOCKET_URL}`
);
export const chatSocket = io(`${import.meta.env.VITE_CHAT_SOCKET_URL}`);
