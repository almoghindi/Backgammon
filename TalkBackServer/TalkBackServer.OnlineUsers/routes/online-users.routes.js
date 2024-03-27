import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addOnlineUser,
  getOnlineUsers,
  getExistByUsername,
} from "../controllers/online-users.controller.js";

const router = express.Router();

router.get("/", getOnlineUsers);
router.post("/", addOnlineUser);
router.get("/get-online-user/:username", getExistByUsername);

export default router;
