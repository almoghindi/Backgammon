import { socket } from "../../socket";
import Game from "../models/game";
import ThisMove from "../models/this-move";
import ThisTurn from "../models/this-turn";
import { celebrateGameEnd } from "./end-game";

export function movingPiece(
  game: Game,
  thisTurn: ThisTurn,
  thisMove: ThisMove
): Game {
  const [fromBarIdx, toBarIdx] = [thisMove._fromBarIdx, thisMove._toBarIdx];

  // Throwing opponent piece out
  if (
    game._board[toBarIdx as number].includes(thisTurn._opponentPlayer._name)
  ) {
    thisTurn._opponentPlayer._outBar.push(
      game._board[toBarIdx as number].pop() as string
    );

    thisTurn._opponentPlayer._inTheEnd = false;

    thisTurn._opponentPlayer._name === game._whitePlayer._name
      ? (game._whitePlayer = thisTurn._opponentPlayer)
      : (game._blackPlayer = thisTurn._opponentPlayer);
  }

  // Returning an out piece
  if (fromBarIdx === thisTurn._turnPlayer._outBarIdx) {
    game._board[toBarIdx as number].push(
      thisTurn._turnPlayer._outBar.pop() as string
    );

    thisTurn._turnPlayer._name === game._whitePlayer._name
      ? (game._whitePlayer = thisTurn._turnPlayer)
      : (game._blackPlayer = thisTurn._turnPlayer);

    return game;
  }

  // Taking a piece out to end bar
  if (fromBarIdx === thisTurn._turnPlayer._endBarIdx) {
    thisTurn._turnPlayer._endBar.push(
      game._board[toBarIdx as number].pop() as string
    );

    thisTurn._turnPlayer._name === game._whitePlayer._name
      ? (game._whitePlayer = thisTurn._turnPlayer)
      : (game._blackPlayer = thisTurn._turnPlayer);

    if (thisTurn._turnPlayer._endBar.length === 15) {
      game._gameOn = false;
      socket.emit("game-win", JSON.stringify(game));
    }

    return game;
  }

  // Moving from 'from' to 'to'
  game._board[toBarIdx as number].push(
    game._board[fromBarIdx as number].pop() as string
  );

  return game;
}
