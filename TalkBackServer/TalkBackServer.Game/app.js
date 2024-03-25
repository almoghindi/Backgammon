import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const socketServer = createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("dice-roll", (turn) => {
    console.log(turn);
    socket.broadcast.emit("user-rolled-dice", turn);
  });
  socket.on("user-selected", (index) => {
    socket.broadcast.emit("oponent-moved", index);
  });
  socket.on("game-start", (gameOBJECT) => {
    socket.broadcast.emit("oponent-started-game", gameOBJECT);
  });
});
io.listen(3003);
