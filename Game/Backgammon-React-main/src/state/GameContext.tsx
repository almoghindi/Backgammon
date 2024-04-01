import { createContext } from "react";
import { useState } from "react";
import Game from "../logic/models/game";
import ThisTurn from "../logic/models/this-turn";
import ThisMove from "../logic/models/this-move";

export type GameContextType = [
  game: Game,
  updateGame: (game: Game) => void,
  thisTurn: ThisTurn,
  updateTurn: (thisTurn: ThisTurn) => void,
  thisMove: ThisMove,
  updateMove: (thisMove: ThisMove) => void
];

export const GameStateContext = createContext<GameContextType>([
  Game.new(),
  () => {},
  ThisTurn.new(),
  () => {},
  ThisMove.new(),
  () => {},
]);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [game, setGame] = useState(Game.new);
  const [thisTurn, setThisTurn] = useState(ThisTurn.new);
  const [thisMove, setThisMove] = useState(ThisMove.new);

  return (
    <GameStateContext.Provider
      value={[game, setGame, thisTurn, setThisTurn, thisMove, setThisMove]}
    >
      {children}
    </GameStateContext.Provider>
  );
};
