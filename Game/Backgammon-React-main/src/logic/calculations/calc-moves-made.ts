import ThisMove from "../models/this-move";
import ThisTurn from "../models/this-turn";

export function calcMovesMade(
  thisTurn: ThisTurn,
  thisMove: ThisMove
): ThisTurn {
  var distance = 0;
  const [fromBarIdx, toBarIdx] = [thisMove._fromBarIdx, thisMove._toBarIdx];

  if (typeof fromBarIdx === "number") {
    if (fromBarIdx <= 11) {
      distance =
        toBarIdx <= 11
          ? Math.abs(fromBarIdx - toBarIdx)
          : fromBarIdx + (toBarIdx - 11);
    } else {
      distance =
        toBarIdx > 11
          ? Math.abs(fromBarIdx - toBarIdx)
          : fromBarIdx + (toBarIdx - 11);
    }
  } else {
    if (fromBarIdx === thisTurn._turnPlayer._outBarIdx) {
      distance =
        thisTurn._turnPlayer._name === "White" ? 12 - toBarIdx : 24 - toBarIdx;
    }

    if (fromBarIdx === thisTurn._turnPlayer._endBarIdx) {
      var distance =
        thisTurn._turnPlayer._name === "White" ? 24 - toBarIdx : 12 - toBarIdx;
    }
  }

  thisTurn._movesMade = distance;

  if (
    thisTurn._movesMade === thisTurn._dices[0] ||
    (thisTurn._turnPlayer._inTheEnd && distance <= thisTurn._dices[0])
  ) {
    thisTurn._maxMoves -= thisTurn._dices.shift() as number;
  } else if (
    thisTurn._movesMade === thisTurn._dices[1] ||
    (thisTurn._turnPlayer._inTheEnd && distance <= thisTurn._dices[1])
  ) {
    thisTurn._maxMoves -= thisTurn._dices.pop() as number;
  }

  return thisTurn;
}
