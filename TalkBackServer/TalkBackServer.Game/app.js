import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import fs from "fs";
import gameRoutes from "./routes/game.routes.js";
import {
  usernameToSocketIdMap,
  openGames,
} from "./controllers/game.controller.js";
import mongoose from "mongoose";

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
  socket.on("game-win", (data) => {
    socket.emit("on-game-won", data);
  });
  socket.on("disconnect", () => {
    const leavingUser = Object.keys(usernameToSocketIdMap).find(
      (username) => usernameToSocketIdMap[username] === socket.id
    );
    io.emit("user-disconnected", leavingUser);
  });
});

io.on("disconnect", () => {
  console.log("disconnected io");
});

mongoose
  .connect(process.env.MONGO_URI + "-Game")
  .then(() => {
    socketServer.listen(process.env.GAME_PORT || 3003);
  })
  .catch((err) => console.log(err));
