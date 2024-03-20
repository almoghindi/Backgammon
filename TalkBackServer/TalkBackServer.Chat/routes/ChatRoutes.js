import express from "express";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/enter-chat", auth, (req, res) => {});

export default router;
