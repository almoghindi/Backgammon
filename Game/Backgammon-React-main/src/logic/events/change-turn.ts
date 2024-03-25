import { toast } from "react-hot-toast";
import { toastStyle } from "../../App";
import Game from "../models/game";
import ThisTurn from "../models/this-turn";

export function changeTurn(game: Game, thisTurn: ThisTurn): ThisTurn {
  if (game._gameOn) {
    thisTurn = changingTurn(thisTurn);
  }

  return thisTurn;
}

export function changingTurn(oldTurn: ThisTurn): ThisTurn {
  const thisTurn = new ThisTurn(
    oldTurn._opponentPlayer,
    oldTurn._turnPlayer,
    [],
    false
  );

  const message = `Turn is now ${thisTurn._turnPlayer._icon}`;
  toast.success(message, toastStyle(thisTurn));

  return thisTurn;
}
