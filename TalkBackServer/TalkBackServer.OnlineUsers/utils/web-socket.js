import { Server as socketIo } from "socket.io";

export const usernameToSocketIdMap = {};
export default function initializeOnlineWebSocket(server) {
  const io = new socketIo(server, {
    cors: {
      origin: "*",
      // methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("user-logged-in", (username) => {
      usernameToSocketIdMap[username] = socket.id;
      socket.broadcast.emit("user-joined", `${username} is online`);
    });

    socket.on("user-logged-out", (username) => {
      socket.broadcast.emit("user-left", `${username} is offline`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  return io;
}
