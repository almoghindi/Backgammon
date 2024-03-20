import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import OfflineUsersRoutes from "./routes/offline-users.routes.js";
import OnlineUsersRoutes from "./routes/online-users.routes.js";
import initializeOnlineWebSocket from "./utils/web-socket.js";

const app = express();
const server = http.createServer(app); // Create HTTP server

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users/offline", OfflineUsersRoutes);
app.use("/api/users/online", OnlineUsersRoutes);

initializeOnlineWebSocket(server);

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

mongoose
  .connect(process.env.MONGO_URI + "-OnlineUsers")
  .then(() => {
    server.listen(process.env.ONLINE_USERS_PORT || 5002);
  })
  .catch((err) => console.log(err));
