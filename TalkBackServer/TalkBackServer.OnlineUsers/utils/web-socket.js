import { Server as socketIo } from "socket.io";

export default function initializeOnlineWebSocket(server) {
  const io = new socketIo(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", () => {
      socket.broadcast.emit("userJoined", "A new user joined the room");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
