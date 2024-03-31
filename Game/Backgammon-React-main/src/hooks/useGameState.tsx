import { useState } from "react";
import { useParams } from "react-router-dom";
import useTimer from "../frontend/components/timer/useTimer";
import Game from "../logic/models/game";
import ThisTurn from "../logic/models/this-turn";
import ThisMove from "../logic/models/this-move";

export default function useGameState() {
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);

  return [game, setGame, thisTurn, setThisTurn, thisMove, setThisMove] as const;
}
