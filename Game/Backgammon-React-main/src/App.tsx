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
import useGameState from "./hooks/useGameState";

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

  const { game, thisTurn, thisMove } = useGameState();

  const {
    handleUserJoined,
    handleDiceRoll,
    handleOpponentSelect,
    handleUserStartedGame,
    opponentStartedGame,
    handleOpponentLeft,
    handleUserSelect,
    rollDice,
    handleGameOver,
    timer,
    isLoading,
    isWaitingForOpponent,
    canPlay,
    isSelecting,
    player,
  } = useGameEvents(username, opponent);

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
    socket.on("on-game-won", (game) => handleGameOver(game, true));
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
              You play as <span className={player}>{player}</span>
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "1em",
            }}
          >
            <Button
              style={{ backgroundColor: "#904E55", color: "#fff" }}
              onClick={() => window.close()}
            >
              Quit game
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
