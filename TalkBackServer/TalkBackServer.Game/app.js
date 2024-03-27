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
    origin: "*", // Change this to your frontend URL
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const usernameToSocketIdMap = {};

export function existsInUsernameToSocketIdMap(username) {
  const arr = Object.keys(usernameToSocketIdMap);
  console.log(arr);
  return arr.includes(username);
}

export const openGames = {};

const sockets = [];

app.use("/api/game", gameRoutes);

const socketServer = createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

export function getGameId(username, opponent) {
  return `${username}&${opponent}`.split("").sort().join("");
}
export function setFirstPlayer(gameId, playername) {
  openGames[gameId].firstPlayer = playername;
}

export function socketEmit(eventName, data, to) {
  io.to(usernameToSocketIdMap[to].emit(eventName, data));
}

io.on("connection", (socket) => {
  socket.on("connect", () => {
    // socket.broadcast.emit("user-conne");
  });
  socket.on("user-joined", ({ username, opponent }) => {
    const gameId = getGameId(username, opponent);
    openGames[gameId] = { firstPlayer: "" };
    usernameToSocketIdMap[username] = socket.id;
    console.log(usernameToSocketIdMap);
    socket.broadcast.emit("user-connection");
  });
  socket.on("dice-roll", (turn) => {
    console.log(turn);
    socket.broadcast.emit("user-rolled-dice", turn);
  });
  socket.on("user-selected", (index) => {
    socket.broadcast.emit("oponent-select", index);
  });
  socket.on("game-start", (gameOBJECT) => {
    socket.broadcast.emit("oponent-started-game", gameOBJECT);
  });
  socket.on("notify-changed-turn", (messageJSON) => {
    socket.broadcast.emit("changed-turn", messageJSON);
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
    socket.broadcast.emit("user-disconnected");
  });
});

io.listen(process.env.GAME_SOCKET_PORT || 4003);

app.listen(process.env.GAME_PORT || 3003);
