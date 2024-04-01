import express from "express";
import {
  getFirstPlayer,
  startGame,
  userJoin,
  rollDice,
  notifyChangeTurn,
  select,
  endGame,
  saveGame,
  getUserDetails,
} from "../controllers/game.controller.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/get-first-player", getFirstPlayer);
router.post("/join-game", auth, userJoin);
router.post("/start-game", startGame);
router.post("/roll-dice", rollDice);
router.post("/notify-change-turn", notifyChangeTurn);
router.post("/select", select);
router.post("/end-game", endGame, saveGame);
router.get("/user-details/:username", getUserDetails);

export default router;
