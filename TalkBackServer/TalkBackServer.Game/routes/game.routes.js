import express from "express";
import {
  getFirstPlayer,
  startGame,
  userJoin,
  rollDice,
  notifyChangeTurn,
  select,
} from "../controllers/game.controller.js";

const router = express.Router();

router.post("/get-first-player", getFirstPlayer);
router.post("/join-game", userJoin);
router.post("/start-game", startGame);
router.post("/roll-dice", rollDice);
router.post("/notify-change-turn", notifyChangeTurn);
router.post("/select", select);

export default router;
