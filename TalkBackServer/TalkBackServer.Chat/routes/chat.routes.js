import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  saveMessage,
  sendMessage,
  getChatBySenderReciever,
<<<<<<< HEAD:TalkBackServer/TalkBackServer.Chat/routes/chat.routes.js
} from "../controllers/chat.controller.js";
=======
  leaveChat,
  enterChat,
} from "../controller/ChatController.js";
>>>>>>> 21c2234b6f4db15c7334248a0e6e4ab706812f3f:TalkBackServer/TalkBackServer.Chat/routes/ChatRoutes.js
const router = express.Router();

router.post("/enter-chat", auth, enterChat, saveMessage);

router.post("/new-message", auth, sendMessage, saveMessage);

router.post("/save-message", auth, saveMessage);

router.post("/fetchMessages", auth, getChatBySenderReciever);

router.post("/leave-chat", auth, leaveChat, saveMessage);

export default router;
