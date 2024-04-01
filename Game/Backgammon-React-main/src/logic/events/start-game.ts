import { toast } from "react-hot-toast";
import { toastStyle } from "../../utils/functions";
import { dice } from "./roll-dice";
import Game from "../models/game";
import ThisTurn from "../models/this-turn";

export function startingGame(game: Game): ThisTurn {
  var thisTurn: ThisTurn;
  while (true) {
    const [whiteFirst, whiteSecond] = dice();
    const [blackFirst, blackSecond] = dice();

    if (whiteFirst + whiteSecond > blackFirst + blackSecond) {
      thisTurn = new ThisTurn(game._whitePlayer, game._blackPlayer, [], false);
      toast.success("Game starts with ⚪ WHITE ⚪", toastStyle(thisTurn));

      break;
    } else if (whiteFirst + whiteSecond < blackFirst + blackSecond) {
      thisTurn = new ThisTurn(game._blackPlayer, game._whitePlayer, [], false);
      toast.success("Game starts with ⚫ BLACK ⚫", toastStyle(thisTurn));

      break;
    }
  }

  return thisTurn;
}
