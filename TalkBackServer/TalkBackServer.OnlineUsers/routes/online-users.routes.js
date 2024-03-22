import express from "express";
import { auth } from "../middlewares/auth.js";
import {
  // addOnlineUser,
  // getOnlineUsers,
  getOfflineUsers,
  getOnlineUsers,
  addUserOrChangeUserStatus,
} from "../controllers/online-users.controller.js";

const router = express.Router();

// router.get("/", auth, getOnlineUsers);
// router.post("/", auth, addOnlineUser);

router.get("/online", getOnlineUsers);
router.get("/offline", auth, getOfflineUsers);
router.post("/changeStatus", addUserOrChangeUserStatus);

export default router;
