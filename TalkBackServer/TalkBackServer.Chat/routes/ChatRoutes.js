import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  saveMessage,
  sendMessage,
  getChatBySenderReciever,
  leaveChat,
  enterChat,
} from "../controller/ChatController.js";
const router = express.Router();

router.post("/enter-chat", auth, enterChat, saveMessage);

router.post("/new-message", auth, sendMessage, saveMessage);

router.post("/save-message", auth, saveMessage);

router.post("/fetchMessages", auth, getChatBySenderReciever);

router.post("/leave-chat", auth, leaveChat, saveMessage);

export default router;
