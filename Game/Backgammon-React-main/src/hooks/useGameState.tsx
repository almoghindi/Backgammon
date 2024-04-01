import { createContext, useContext } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useTimer from "../frontend/components/timer/useTimer";
import Game from "../logic/models/game";
import ThisTurn from "../logic/models/this-turn";
import ThisMove from "../logic/models/this-move";
import { GameContextType, GameStateContext } from "../state/GameContext";



const useGameState = () => {
  const contextValue: GameContextType = useContext(GameStateContext);

  if (!contextValue) {
    throw new Error("GameStateContext value is undefined");
  }

  const [game, setGame, thisTurn, setThisTurn, thisMove, setThisMove] =
    contextValue;

  const updateTurn = (newTurn: ThisTurn) => {
    setThisTurn(newTurn);
  };
  const updateMove = (newMove: ThisMove) => {
    setThisMove(newMove);
  };
  const updateGame = (newGame: Game) => {
    setGame(newGame);
  };

  return { game, updateGame, thisTurn, updateTurn, thisMove, updateMove };
};

export default useGameState;
