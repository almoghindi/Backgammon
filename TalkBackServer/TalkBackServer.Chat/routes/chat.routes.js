import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  saveMessage,
  sendMessage,
  getChatBySenderReciever,
  leaveChat,
  enterChat,
} from "../controllers/chat.controller.js";
const router = express.Router();

router.post("/enter-chat", auth, enterChat);

router.post("/new-message", auth, sendMessage, saveMessage);

router.post("/save-message", auth, saveMessage);

router.post("/fetchMessages", auth, getChatBySenderReciever);

router.post("/leave-chat", auth, leaveChat);

export default router;
