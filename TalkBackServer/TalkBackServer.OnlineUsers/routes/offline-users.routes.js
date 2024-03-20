import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getOfflineUsers,
  postOfflineUser,
} from "../controllers/offline-users.controller.js";

const router = express.Router();

router.get("/", auth, getOfflineUsers);
router.post("/", auth, postOfflineUser);

export default router;
