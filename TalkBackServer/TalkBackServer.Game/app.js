import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
import gameRoutes from "./routes/game.routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/game", gameRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.status || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const sockets = [];
const socketServer = http.createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

export function socketEmit(eventName, data, to) {
  console.log("Emitting: " + eventName);
  io.to(to).emit(eventName, data);
}

io.on("connection", (socket) => {
  // socket.on("dice-roll", (turn) => {
  //   socket.broadcast.emit("user-rolled-dice", turn);
  // });
  // socket.on("user-selected", (json) => {
  //   socket.broadcast.emit("opponent-select", json);
  // });
  // socket.on("game-start", (gameOBJECT) => {
  //   socket.broadcast.emit("oponent-started-game", gameOBJECT);
  // });
  // socket.on("notify-changed-turn", (messageJSON) => {
  //   socket.broadcast.emit("changed-turn", messageJSON);
  // });
  socket.on("disconnect", () => {
    console.log("disconnection");
  });
});

io.on("disconnect", () => {
  console.log("disconnected io");
});

// io.listen(process.env.GAME_SOCKET_PORT || 4003);

socketServer.listen(process.env.GAME_PORT || 3003);
