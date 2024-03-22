import express from "express";
import { auth } from "../middlewares/auth.js";
import { addUserToSocketMap, emitEventToUser } from "../app.js";
import {
  saveMessage,
  sendMessage,
  getChatBySenderReciever,
} from "../controllers/chat.controller.js";
const router = express.Router();

router.post("/enter-chat", auth, (req, res) => {
  const { data, to } = req.body;
  addUserToSocketMap(data);
  emitEventToUser("user-joined", data.username, to);
  res.status(200).json("user joined successfully");
});

router.post("/new-message", auth, sendMessage, saveMessage);

router.post("/save-message", auth, saveMessage);

router.post("/fetchMessages", auth, getChatBySenderReciever);

export default router;
