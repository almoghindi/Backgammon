import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  addOnlineUser,
  getOnlineUsers,
} from "../controllers/online-users.controller.js";

const router = express.Router();

router.get("/", auth, getOnlineUsers);
router.post("/", auth, addOnlineUser);

export default router;
