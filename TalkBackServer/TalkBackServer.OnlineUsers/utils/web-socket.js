import { Server as socketIo } from "socket.io";

export default function initializeOnlineWebSocket(server) {
  const io = new socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("userLoggedIn", (username) => {
      socket.broadcast.emit("userLoggedIn", `${username} is online`);
      console.log(`${username} is online`);
    });

    socket.on("userLoggedOut", (username) => {
      socket.broadcast.emit("userLoggedOut", `${username} is offline`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
