import { useEffect, useMemo, useState } from "react";
import useGameState from "./useGameState";
import useTimer from "../frontend/components/timer/useTimer";
import Game from "../logic/models/game";
import { startingGame } from "../logic/events/start-game";
import {
  getStartingPlayer,
  notifyChangeTurn,
  requestEndGame,
  requestRollDice,
  requestStartGame,
  requestUserSelect,
} from "../http/requests";
import ThisTurn from "../logic/models/this-turn";
import ThisMove from "../logic/models/this-move";
import toast from "react-hot-toast";
import { toastMessage, toastStyle } from "../utils/functions";
import { getDiceToast, rollingDice } from "../logic/events/roll-dice";
import { checkCantMove } from "../logic/calculations/calc-possible-moves";
import { changeTurn } from "../logic/events/change-turn";
import { handleUserLeftGameEnd } from "../logic/events/end-game";
import { selecting } from "../logic/events/select";

interface GameObjectModel {
  game: Game;
  turn: ThisTurn;
  move: ThisMove;
  isStarting: boolean;
}

export default function useGameEvents(username: string, opponent: string) {
  const { game, updateGame, thisTurn, updateTurn, thisMove, updateMove } =
    useGameState();
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(true);
  const [player, setPlayer] = useState<string>("");
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isStartingPlayer, setIsStartingPlayer] = useState(false);
  const [timer, setTimer] = useTimer();
  const [isLoading, setIsLoading] = useState(false);

  const canPlay: boolean = useMemo(() => {
    return player === thisTurn._turnPlayer._name && isStartingPlayer;
  }, [thisTurn, player, isStartingPlayer]);

  async function startGame() {
    const tempGame = Game.new();
    tempGame._gameOn = true;
    updateGame(tempGame);

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
    updateTurn(turn);

    const tempThisMove = ThisMove.new();
    updateMove(tempThisMove);
    const result: GameObjectModel = {
      game: tempGame,
      turn,
      move: tempThisMove,
      isStarting: !isStarting,
    };
    return result;
  }

  function opponentStartedGame(gameJson: string) {
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
    updateGame(game);
    updateTurn(newTurn);
    updateMove(move);
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

    updateTurn(turn);
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
    updateTurn(returnedThisTurn);
  }

  function select(data: string) {
    const { newgame, turn, move } = JSON.parse(data);

    updateGame(newgame);
    updateTurn(turn);
    updateMove(move);
  }

  function turnRanOutOfTime() {
    setIsSelecting(false);
    const newTurn = changeTurn(game, thisTurn);
    const message = `Turn is now ${thisTurn._opponentPlayer._icon}`;
    const toastMessage = JSON.stringify({ message, turn: thisTurn });
    updateTurn(newTurn);
    notifyChangeTurn(username, opponent, toastMessage);
  }

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

  function handleOpponentLeft(leavingUser: string) {
    if (leavingUser === opponent) {
      toast.error("Opponent left the game", toastStyle(thisTurn));
      setTimer(0);
      const newGame = {
        ...game,
        _gameOn: false,
      };
      handleUserLeftGameEnd(thisTurn);
      requestEndGame(username, opponent);
      updateGame(game);
    }
  }

  async function handleUserSelect(index: number | string) {
    setIsStartingPlayer(true);
    if (!canPlay) return;
    setIsSelecting(true);
    const memoizedGame = {
      newgame: { ...game },
      turn: { ...thisTurn },
      move: { ...thisMove },
    };
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
    setIsLoading(true);
    const requestSuccessful = await requestUserSelect(
      username,
      opponent,
      gameJSON
    );
    if (!requestSuccessful) {
      setIsSelecting(false);
      select(JSON.stringify(memoizedGame));
      toast.error("Network failed, try again");
    } else {
      if (returnedThisTurn._opponentPlayer !== thisTurn._opponentPlayer) {
        const message = `Turn is now ${thisTurn._opponentPlayer._icon}`;
        const toastMessage = JSON.stringify({
          message,
          turn: returnedThisTurn,
        });
        notifyChangeTurn(username, opponent, toastMessage);
      }
      if (!returnedThisTurn._rolledDice) {
        setIsSelecting(false);
      }
      select(gameJSON);
    }
    setIsLoading(false);
  }

  function handleOpponentSelect(json: string) {
    select(json);
    const { newgame } = JSON.parse(json);
    if (newgame._gameOn) return;
    debugger;
    toast("You lost!", toastStyle(thisTurn));
    setTimer(0);
  }

  return {
    handleUserJoined,
    handleDiceRoll,
    handleOpponentSelect,
    handleUserStartedGame,
    handleOpponentLeft,
    handleUserSelect,
    opponentStartedGame,
    isLoading,
    isWaitingForOpponent,
    timer,
    select,
    game,
    thisTurn,
    thisMove,
    rollDice,
    canPlay,
    isSelecting,
    player,
    isStartingPlayer,
  };
}
