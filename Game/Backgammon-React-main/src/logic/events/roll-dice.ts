import { toast } from "react-hot-toast";
import { toastStyle } from "../../App";
import ThisTurn from "../models/this-turn";

export function dice(): number[] {
  const first = Math.floor(Math.random() * 6) + 1;
  const second = Math.floor(Math.random() * 6) + 1;

  return [first, second];
}

export function rollingDice(tempTurn: ThisTurn) {
  const thisTurn = new ThisTurn(
    tempTurn._turnPlayer,
    tempTurn._opponentPlayer,
    dice(),
    true
  );
  getDiceToast(thisTurn._dices[0], thisTurn._dices[1], thisTurn);

  return thisTurn;
}

export function getDiceToast(dice1: number, dice2: number, turn: ThisTurn) {
  if (dice1 === dice2) {
    toast.success(
      `${turn._turnPlayer._icon}
      🎲 Rolled a double ${turn._dices} 🎲`,
      toastStyle(turn)
    );
  } else {
    toast.success(
      `${turn._turnPlayer._icon}
      🎲 Rolled ${turn._dices} 🎲`,
      toastStyle(turn)
    );
  }
}
