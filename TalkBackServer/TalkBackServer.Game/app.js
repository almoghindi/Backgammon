import { Server } from "socket.io";
import { createServer } from "http";
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

const sockets = [];
const socketServer = createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

app.use("/api/game", gameRoutes);

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

io.on("disconnection", () => {
  console.log("disconnected io");
});

io.listen(process.env.GAME_SOCKET_PORT || 4003);

app.listen(process.env.GAME_PORT || 3003);
