import express from "express";
import { getFirstPlayer } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/get-first-player", getFirstPlayer);

export default router;
