import express from "express";
import { getFirstPlayer, userJoin } from "../controllers/game.controller.js";

const router = express.Router();

router.post("/get-first-player", getFirstPlayer);
router.post("/join-game", userJoin);

export default router;
