import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addOnlineUser,
  getOnlineUsers,
  existByUsername,
  gameInvite,
} from "../controllers/online-users.controller.js";

const router = express.Router();

router.get("/", getOnlineUsers);
router.post("/", addOnlineUser);
router.post("/exist-online-user", existByUsername);
router.post("/game-invite", gameInvite);

export default router;
