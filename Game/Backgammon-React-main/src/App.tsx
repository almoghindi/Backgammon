import { memo, useEffect, useMemo } from "react";
import "./App.css";
import { socket } from "./socket.js";
import BoardBottom from "./frontend/BoardBottom";
import BoardTop from "./frontend/BoardTop";
import { useParams } from "react-router-dom";
import LoadingPage from "./frontend/components/loading/LoadingPage";
import Timer from "./frontend/components/timer/Timer";
import LoadingSpinner from "./frontend/components/loading/LoadingSpinner";
import useGameEvents from "./hooks/useGameEvents";
import { toastMessage } from "./utils/functions";
import toast from "react-hot-toast";
import { Button } from "@mui/material";
import { useHttpClient } from "./http/useHttp";
import Dice from "./frontend/components/Dice/Dice";
import { useSelector } from "react-redux";
import { RootState } from "./state/store";
import Game from "./logic/models/game";
import ThisTurn from "./logic/models/this-turn";
import ThisMove from "./logic/models/this-move";
import useTimer from "./frontend/components/timer/useTimer";

function App() {
  const { users } = useParams();
  const [username, opponent] = useMemo(() => {
    if (!users) return "";
    const parsedUsers = users?.split("&");
    const username = parsedUsers[0];
    const opponent = parsedUsers[1];
    return [username, opponent];
  }, [users]);
  const { joinGame } = useHttpClient();

  const { player, isSelecting, isWaitingForOpponent } = useSelector(
    (state: RootState) => state.player
  );
  const gameSlice = useSelector((state: RootState) => state.game);

  const game: Game = useMemo(() => {
    const temp = Game.fromJSON(gameSlice.game);
    if (temp === null) throw new Error("Game is null");
    return temp;
  }, [gameSlice.game]);

  const thisTurn: ThisTurn = useMemo(() => {
    return ThisTurn.fromJSON(gameSlice.thisTurn);
  }, [gameSlice.thisTurn]);

  const thisMove: ThisMove = useMemo(() => {
    return JSON.parse(gameSlice.thisMove);
  }, [gameSlice.thisMove]);

  const {
    handleUserJoined,
    handleDiceRoll,
    handleOpponentSelect,
    handleUserStartedGame,
    turnRanOutOfTime,
    opponentStartedGame,
    handleOpponentLeft,
    handleUserSelect,
    rollDice,
    isLoading,
    canPlay,
  } = useGameEvents(username, opponent);
  const [timer, setTimer] = useTimer();
  useEffect(() => {
    if (timer === 0) {
      if (!game._gameOn) return;
      turnRanOutOfTime();
      setTimer(119);
    }
  }, [timer]);

  useEffect(() => {
    if (!game._gameOn) setTimer(0);
  }, [game._gameOn]);

  useEffect(() => {
    setTimer(119);
  }, [thisMove]);

  useEffect(() => {
    async function tryJoin() {
      const joinSuccessful = await joinGame(username, opponent, socket.id);
      if (!joinSuccessful) {
        toast.error(
          "Could not join game or game is currently on, try again later."
        );
      }
    }
    tryJoin();
  }, [socket.id]);



  useEffect(() => {
    socket.on("user-connection", handleUserJoined);
    socket.on("user-rolled-dice", handleDiceRoll);
    socket.on("opponent-select", handleOpponentSelect);
    socket.on("opponent-started-game", opponentStartedGame);
    socket.on("changed-turn", toastMessage);
    socket.on("game-over", toastMessage);
    socket.on("user-disconnected", handleOpponentLeft);
    return () => {
      socket.off("user-connection", handleUserStartedGame);
      socket.off("user-rolled-dice", handleDiceRoll);
      socket.off("opponent-select", handleOpponentSelect);
      socket.off("opponent-started-game", opponentStartedGame);
      socket.off("changed-turn", toastMessage);
      socket.off("game-over", toastMessage);
      socket.off("user-disconnected", handleOpponentLeft);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {isWaitingForOpponent && <LoadingPage />}
      {!isWaitingForOpponent && (
        <div>
          <div className="header">
            <h1>
              You play as{" "}
              <span className={player === null ? "" : player}>{player}</span>
            </h1>
            <div className="dice">
              {thisTurn._dices && canPlay && (
                <Dice dice={thisTurn._dices}></Dice>
              )}
            </div>
            <div>
              <Timer timer={timer} />
            </div>
          </div>
          <BoardTop
            game={game}
            thisMove={thisMove}
            select={handleUserSelect}
            isBlack={player === "Black"}
          />

          <BoardBottom
            game={game}
            thisMove={thisMove}
            rollDice={rollDice}
            startGame={handleUserStartedGame}
            select={handleUserSelect}
            canPlay={canPlay}
            isSelecting={isSelecting}
          />
          <div>
            <Button className="" onClick={() => window.close()}>
              Quit game
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
