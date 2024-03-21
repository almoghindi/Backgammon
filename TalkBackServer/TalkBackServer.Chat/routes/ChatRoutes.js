import express from "express";
import { auth } from "../middlewares/auth.js";
import { addUserToSocketMap, emitEventToUser } from "../app.js";
const router = express.Router();

router.post("/enter-chat", auth, (req, res) => {
  const { data, to } = req.body;
  addUserToSocketMap(data);
  emitEventToUser("user-joined", data.username, to);
  res.status(200).json("user joined successfully");
});

router.post("/new-message", auth, (req, res) => {
  const { message, to } = req.body;
  emitEventToUser("new-message", message, to);
  res.status(200).json("message sent successfully");
});

export default router;
