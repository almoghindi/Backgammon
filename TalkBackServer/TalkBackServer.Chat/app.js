import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import ChatRoutes from "./routes/ChatRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const socketServer = http.createServer(app);
export const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

const usernameToSocketIdMap = {};

export function addUserToSocketMap(userData) {
  const { username, socketId } = userData;
  usernameToSocketIdMap[username] = socketId;
}
export function emitEventToUser(eventName, message, to) {
  io.to(usernameToSocketIdMap[to]).emit(eventName, message);
}

io.on("connection", (socket) => {});

app.use("/api/chat", ChatRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
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
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

io.listen(process.env.CHAT_SOCKET_PORT);

mongoose
  .connect(process.env.MONGO_URI + "-Chat")
  .then(() => {
    app.listen(process.env.CHAT_PORT || 5003);
  })
  .catch((err) => console.log(err));
