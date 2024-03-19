import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  getOfflineUsers,
  postOfflineUser,
} from "../controllers/OfflineUsersController.js";

const router = express.Router();

router.get("/", auth, getOfflineUsers);
router.post("/", auth, postOfflineUser);

export default router;
