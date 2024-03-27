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
import {
  getStartingPlayer,
  joinGame,
  notifyChangeTurn,
  requestRollDice,
  requestStartGame,
  requestUserSelect,
} from "./http/requests";
import { useHttpClient } from "./http/useHttp";
import LoadingSpinner from "./frontend/components/loading/LoadingSpinner";

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
  const [isLoading, setIsLoading] = useState(false);

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

  async function startGame() {
    const tempGame = Game.new();
    tempGame._gameOn = true;
    setGame(tempGame);

    const tempThisTurn = startingGame(game);
    const startingUser = await getStartingPlayer(username, opponent);

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

  function oponentStartedGame(gameJson: string) {
    setIsWaitingForOpponent(false);
    const result = JSON.parse(gameJson);
    const { game, turn, move, isStarting } = result;
    const newTurn = new ThisTurn(
      turn._opponentPlayer,
      turn._turnPlayer,
      [],
      false
    );

    setIsStartingPlayer(isStarting);

    setPlayer(turn._opponentPlayer._name);
    setGame(game);
    setThisTurn(newTurn);
    setThisMove(move);
    const toastmessageJSON = JSON.stringify({
      message: isStarting
        ? `You start!`
        : `Game starts with ${newTurn._opponentPlayer._name}`,
      turn: newTurn,
    });
    toastMessage(toastmessageJSON);
  }

  async function handleUserStartedGame() {
    const gameObj: GameObjectModel = await startGame();

    await requestStartGame(username, opponent, JSON.stringify(gameObj));
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
    await requestStartGame(username, opponent, JSON.stringify(gameObj));
  }

  useEffect(() => {
    joinGame(username, opponent, socket.id);
  }, [socket.id]);

  useEffect(() => {
    socket.on("user-connection", handleUserJoined);
    socket.on("user-rolled-dice", handleDiceRoll);
    socket.on("opponent-select", handleOponentSelect);
    socket.on("opponent-started-game", oponentStartedGame);
    socket.on("changed-turn", toastMessage);
    socket.on("game-over", toastMessage);
    socket.on("user-disconnected", handleOpponentLeft);
    return () => {
      socket.off("user-connection", handleUserStartedGame);
      socket.off("user-rolled-dice", handleDiceRoll);
      socket.off("opponent-select", handleOponentSelect);
      socket.off("opponent-started-game", oponentStartedGame);
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

    requestRollDice(username, opponent, JSON.stringify(returnedThisTurn));
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
    notifyChangeTurn(username, opponent, toastMessage);
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

  async function handleUserSelect(index: number | string) {
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
      notifyChangeTurn(username, opponent, toastMessage);
    }
    if (!returnedThisTurn._rolledDice) {
      setIsSelecting(false);
    }
    const gameJSON = JSON.stringify({
      newgame: returnedGame,
      turn: returnedThisTurn,
      move: returnedThisMove,
    });
    setIsLoading(true);
    const selected = await requestUserSelect(username, opponent, gameJSON);
    if (!selected) {
      toast.error("Network failed, try again");
      setIsLoading(false);
      return;
    };
    select(gameJSON);
    setIsLoading(false);
    // socket.emit("user-selected", gameJSON);
  }

  function handleOponentSelect(json: string) {
    select(json);
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}
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
