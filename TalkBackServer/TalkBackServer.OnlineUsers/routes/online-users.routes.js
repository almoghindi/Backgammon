import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addOnlineUser,
  getOnlineUsers,
  getExistByUsername,
  gameInvite,
} from "../controllers/online-users.controller.js";

const router = express.Router();

router.get("/", getOnlineUsers);
router.post("/", addOnlineUser);
router.get("/get-online-user/:username", getExistByUsername);
router.post("/game-invite", gameInvite);

export default router;
