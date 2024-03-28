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

    socket.on("user-online", (username) => {
      usernameToSocketIdMap[username] = socket.id;
    });

    socket.on("user-logged-out", (username) => {
      socket.broadcast.emit("user-left", `${username} is offline`);
    });

    socket.on("invite-canceled", (to) => {
      io.to(usernameToSocketIdMap[to]).emit("cancel-invite");
    });

    socket.on("invite-declined", (from) => {
      io.to(usernameToSocketIdMap[from]).emit("decline-invite");
    });

    socket.on("invite-accepted", (from) => {
      io.to(usernameToSocketIdMap[from]).emit("accept-invite");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  return io;
}
