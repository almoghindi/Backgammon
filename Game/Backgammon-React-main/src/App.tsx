import { useEffect, useMemo, useState } from "react";
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
import { faL, fas } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingPage from "./frontend/components/loading/LoadingPage";
import useTimer from "./frontend/components/timer/useTimer";
import Timer from "./frontend/components/timer/Timer";
import { changeTurn } from "./logic/events/change-turn";
import {
  celebrateGameEnd,
  handleUserLeftGameEnd,
} from "./logic/events/end-game";

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
  isStarting: boolean;
}

function App() {
  const { users } = useParams();
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(true);
  const [player, setPlayer] = useState<string>("");
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isStartingPlayer, setIsStartingPlayer] = useState(false);
  const [timer, setTimer] = useTimer();

  // window.onload = () => backgammon();

  const canPlay: boolean = useMemo(() => {
    return player === thisTurn._turnPlayer._name && isStartingPlayer;
  }, [thisTurn, player, isStartingPlayer]);

  const [username, opponent] = useMemo(() => {
    if (!users) return "";
    const parsedUsers = users?.split("&");
    const username = parsedUsers[0];
    const opponent = parsedUsers[1];
    return [username, opponent];
  }, [users]);

  const getStartingPlayer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3003/api/game/get-first-player`,
        {
          method: "POST",
          body: JSON.stringify({
            users: [username, opponent],
          }),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.result;
    } catch (err) {
      console.error(err);
    }
  };

  async function startGame() {
    const tempGame = Game.new();
    tempGame._gameOn = true;
    setGame(tempGame);

    const tempThisTurn = startingGame(game);
    const startingUser = await getStartingPlayer();
    console.log(startingUser);
    console.log(username);
    const isStarting = startingUser === username;
    setIsStartingPlayer(isStarting);
    let turn;
    if (isStarting) {
      setPlayer(tempThisTurn._turnPlayer._name);
      turn = tempThisTurn;
    } else {
      setPlayer(tempThisTurn._opponentPlayer._name);
      turn = new ThisTurn(
        tempThisTurn._opponentPlayer,
        tempThisTurn._turnPlayer,
        [],
        false
      );
    }
    setThisTurn(turn);

    const tempThisMove = ThisMove.new();
    setThisMove(tempThisMove);
    const result: GameObjectModel = {
      game: tempGame,
      turn,
      move: tempThisMove,
      isStarting: !isStarting,
    };
    return result;
  }

  function oponentStartedGame(gameOBJECT: GameObjectModel) {
    setIsWaitingForOpponent(false);
    const result = gameOBJECT;
    const { game, turn, move, isStarting } = result;
    const newTurn = new ThisTurn(
      turn._opponentPlayer,
      turn._turnPlayer,
      [],
      false
    );
    console.log(isStarting);
    setIsStartingPlayer(isStarting);
    const toastmessageJSON = JSON.stringify({
      message:
        turn._opponentPlayer._name === "Black"
          ? "Game starts with ⚫ BLACK ⚫"
          : "Game starts with ⚪ WHITE ⚪",
      turn,
    });
    toastMessage(toastmessageJSON);
    setPlayer(turn._opponentPlayer._name);
    setGame(game);
    setThisTurn(newTurn);
    setThisMove(move);
  }

  async function handleUserStartedGame() {
    const gameObj: GameObjectModel = await startGame();
    socket.emit("game-start", gameObj);
  }

  function oponentRolledDice(turn: ThisTurn) {
    setIsStartingPlayer(true);
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

  async function handleUserJoined() {
    setIsWaitingForOpponent(false);
    const gameObj: GameObjectModel = await startGame();
    socket.emit("game-start", gameObj);
  }

  useEffect(() => {
    socket.emit("user-joined", { username, opponent });
    socket.on("user-connection", handleUserJoined);
    socket.on("user-rolled-dice", handleDiceRoll);
    socket.on("oponent-select", handleOponentSelect);
    socket.on("oponent-started-game", oponentStartedGame);
    socket.on("changed-turn", toastMessage);
    socket.on("game-over", toastMessage);
    socket.on("user-disconnected", handleOpponentLeft);
    return () => {
      socket.off("user-connection", handleUserStartedGame);
      socket.off("user-rolled-dice", handleDiceRoll);
      socket.off("oponent-select", handleOponentSelect);
      socket.off("oponent-started-game", oponentStartedGame);
      socket.off("changed-turn", toastMessage);
      socket.off("game-over", toastMessage);
      socket.off("user-disconnected", handleOpponentLeft);
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

  function toastMessage(messageJSON: string) {
    const { message, turn } = JSON.parse(messageJSON);
    toast.success(message, toastStyle(turn));
  }

  function turnRanOutOfTime() {
    setIsSelecting(false);
    const newTurn = changeTurn(game, thisTurn);
    const message = `Turn is now ${thisTurn._opponentPlayer._icon}`;
    const toastMessage = JSON.stringify({ message, turn: thisTurn });
    setThisTurn(newTurn);
    socket.emit("notify-changed-turn", toastMessage);
  }

  useEffect(() => {
    if (timer === 0) turnRanOutOfTime();
  }, [timer]);

  useEffect(() => {
    setTimer(119);
  }, [thisMove]);

  function handleOpponentLeft() {
    const newGame = {
      ...game,
      _gameOn: false,
    };
    handleUserLeftGameEnd(thisTurn);
    setGame(game);
  }

  function handleUserSelect(index: number | string) {
    setIsStartingPlayer(true);
    if (!canPlay) return;
    setIsSelecting(true);
    const [returnedGame, returnedThisTurn, returnedThisMove] = selecting(
      index,
      game,
      thisTurn,
      thisMove
    );
    if (returnedThisTurn._opponentPlayer !== thisTurn._opponentPlayer) {
      setIsSelecting(false);
      const message = `Turn is now ${thisTurn._opponentPlayer._icon}`;
      const toastMessage = JSON.stringify({ message, turn: returnedThisTurn });
      socket.emit("notify-changed-turn", toastMessage);
    }
    if (!returnedThisTurn._rolledDice) {
      setIsSelecting(false);
    }
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
  return (
    <>
      {isWaitingForOpponent && <LoadingPage />}
      {!isWaitingForOpponent && (
        <div>
          <div className="header">
            <h1>
              You play as <span className={player}>{player}</span>
            </h1>
            <div className="dice">
              {thisTurn._dices && canPlay && <h3>{thisTurn._dices}</h3>}
            </div>
            <div>
              <Timer timer={timer} />
            </div>
          </div>
          <BoardTop game={game} thisMove={thisMove} select={handleUserSelect} />

          <BoardBottom
            game={game}
            thisMove={thisMove}
            rollDice={rollDice}
            startGame={handleUserStartedGame}
            select={handleUserSelect}
            canPlay={canPlay}
            isSelecting={isSelecting}
          />
        </div>
      )}
    </>
  );
}

export default App;
