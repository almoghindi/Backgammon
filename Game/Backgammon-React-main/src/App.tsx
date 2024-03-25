import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./App.css";
import { backgammon, startingGame } from "./logic/events/start-game";
import { socket } from "./socket.js";
import { getDiceToast, rollingDice } from "./logic/events/roll-dice";
import { selecting } from "./logic/events/select";
import BoardBottom from "./frontend/BoardBottom";
import ThisTurn from "./logic/models/this-turn";
import Game from "./logic/models/game";
import ThisMove from "./logic/models/this-move";
import BoardTop from "./frontend/BoardTop";
import { checkCantMove } from "./logic/calculations/calc-possible-moves";
import Dice from "./frontend/components/Dice/Dice";

export const toastStyle = (thisTurn: ThisTurn) => {
  return {
    style: {
      borderRadius: "10px",
      background: thisTurn._turnPlayer._name,
      color: thisTurn._opponentPlayer._name,
      border:
        thisTurn._turnPlayer._name === "White"
          ? "2px solid black"
          : "2px solid white",
    },
  };
};

interface GameObjectModel {
  game: Game;
  turn: ThisTurn;
  move: ThisMove;
}

function App() {
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);
  const [isWaitingForOponent, setIsWaitingForOponent] = useState(true);

  // window.onload = () => backgammon();

  function startGame() {
    const tempGame = Game.new();
    tempGame._gameOn = true;
    setGame(tempGame);

    const tempThisTurn = startingGame(game);
    setThisTurn(tempThisTurn);

    const tempThisMove = ThisMove.new();
    setThisMove(tempThisMove);
    const result: GameObjectModel = {
      game: tempGame,
      turn: tempThisTurn,
      move: tempThisMove,
    };
    return result;
  }

  function oponentStartedGame(gameOBJECT: GameObjectModel) {
    const result = gameOBJECT;
    const { game, turn, move } = result;
    const tempTurn = startingGame(game);
    setGame(game);
    setThisTurn(tempTurn);
    setThisMove(move);
  }

  function handleUserStartedGame() {
    setIsWaitingForOponent(false);
    const gameObj: GameObjectModel = startGame();
    socket.emit("game-start", gameObj);
  }

  function oponentRolledDice(turn: ThisTurn) {
    if (thisTurn._rolledDice) {
      toast.error(
        `Play your move first
          ${thisTurn.turnPlayer.icon} 🎲 ${thisTurn.dices} 🎲`,
        toastStyle(thisTurn)
      );

      return;
    }

    getDiceToast(turn._dices[0], turn._dices[1], turn);
    if (turn._rolledDice) turn = checkCantMove(game, turn);

    setThisTurn(turn);
  }

  function handleDiceRoll(turnJson: string) {
    const turn = JSON.parse(turnJson);
    oponentRolledDice(turn);
  }

  useEffect(() => {
    socket.on("user-joined", handleUserStartedGame);
    socket.on("user-rolled-dice", handleDiceRoll);
    socket.on("oponent-moved", handleOponentSelect);
    socket.on("oponent-started-game", oponentStartedGame);
    return () => {
      socket.off("user-joined", handleUserStartedGame);
      socket.off("user-rolled-dice", handleDiceRoll);
      socket.off("oponent-moved", handleOponentSelect);
      socket.off("oponent-started-game", oponentStartedGame);
    };
  }, []);

  function rollDice() {
    if (thisTurn.rolledDice) {
      toast.error(
        `Play your move first
          ${thisTurn.turnPlayer.icon} 🎲 ${thisTurn.dices} 🎲`,
        toastStyle(thisTurn)
      );

      return;
    }

    var returnedThisTurn = rollingDice(thisTurn);
    if (returnedThisTurn._rolledDice)
      returnedThisTurn = checkCantMove(game, returnedThisTurn);

    socket.emit("dice-roll", JSON.stringify(returnedThisTurn));
    setThisTurn(returnedThisTurn);
  }

  function select(data: string) {
    const { newgame, turn, move } = JSON.parse(data);

    setGame(newgame);
    setThisTurn(turn);
    setThisMove(move);
  }

  function handleUserSelect(index: number | string) {
    const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
      index,
      game,
      thisTurn,
      thisMove
    );
    const gameJSON = JSON.stringify({
      newgame: returnedGame,
      turn: returnedThisTurn,
      move: returnedThisMove,
    });
    select(gameJSON);
    socket.emit("user-selected", gameJSON);
  }

  function handleOponentSelect(json: string) {
    select(json);
  }
  useEffect(() => {
    console.log(game);
  }, [game]);
  return (
    <>
      <div className="header">
        {thisTurn._dices && <Dice dice={thisTurn._dices} isRolling={false} />}
      </div>
      <BoardTop game={game} thisMove={thisMove} select={handleUserSelect} />

      <BoardBottom
        game={game}
        thisMove={thisMove}
        rollDice={rollDice}
        startGame={handleUserStartedGame}
        select={handleUserSelect}
      />
    </>
  );
}

export default App;
