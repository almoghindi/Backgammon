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
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSelecting,
  setIsStartingPlayer,
  setIsWaitingForOpponent,
  setPlayer,
} from "../state/slices/playerSlice";
import { RootState } from "../state/store";
import { setGame, setThisMove, setThisTurn } from "../state/slices/gameSlice";
import { json } from "react-router-dom";

interface GameObjectModel {
  game: Game;
  turn: ThisTurn;
  move: ThisMove;
  isStarting: boolean;
}

export default function useGameEvents(username: string, opponent: string) {
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

  const [isLoading, setIsLoading] = useState(false);

  const { player, isSelecting, isStartingPlayer, isWaitingForOpponent } =
    useSelector((state: any) => state.player);
  const dispatch = useDispatch();

  const canPlay: boolean = useMemo(() => {
    return player === thisTurn._turnPlayer._name && isStartingPlayer;
  }, [thisTurn, player, isStartingPlayer]);

  function consolelog() {
    console.log("game", game);
    console.log("thisTurn", thisTurn);
    console.log("thisMove", thisMove);
    console.log("player", player);
    console.log("isSelecting", isSelecting);
    console.log("isStartingPlayer", isStartingPlayer);
    console.log("isWaitingForOpponent", isWaitingForOpponent);
    console.log("canPlay", canPlay);
  }

  async function startGame() {
    const tempGame = Game.new();
    tempGame._gameOn = true;
    dispatch(setGame(tempGame.toJSON()));

    const tempThisTurn = startingGame(game);
    const startingUser = await getStartingPlayer(username, opponent);

    const isStarting = startingUser === username;
    dispatch(setIsStartingPlayer(isStarting));

    let turn;
    if (isStarting) {
      dispatch(setPlayer(tempThisTurn._turnPlayer._name));
      turn = tempThisTurn;
    } else {
      dispatch(setPlayer(tempThisTurn._opponentPlayer._name));
      turn = new ThisTurn(
        tempThisTurn._opponentPlayer,
        tempThisTurn._turnPlayer,
        [],
        false
      );
    }
    dispatch(setThisTurn(turn.toJSON()));

    const tempThisMove = ThisMove.new();
    dispatch(setThisMove(JSON.stringify(tempThisMove)));
    const result: GameObjectModel = {
      game: tempGame,
      turn,
      move: tempThisMove,
      isStarting: !isStarting,
    };
    return result;
  }

  function opponentStartedGame(gameJson: string) {
    dispatch(setIsWaitingForOpponent(false));
    const result = JSON.parse(gameJson);
    const { game: newGame, turn, move, isStarting } = result;
    let parsedTurn = ThisTurn.fromJSON(turn);
    const newTurn = new ThisTurn(
      parsedTurn._opponentPlayer,
      parsedTurn._turnPlayer,
      turn._dices,
      turn._rolledDice
    );

    dispatch(setIsStartingPlayer(isStarting));

    dispatch(setPlayer(parsedTurn._opponentPlayer._name));
    dispatch(setGame(newGame));
    dispatch(setThisTurn(newTurn.toJSON()));
    dispatch(setThisMove(JSON.stringify(move)));
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
    dispatch(setIsStartingPlayer(true));
    if (thisTurn._rolledDice) {
      toast.error(
        `Play your move first
          ${thisTurn._turnPlayer._icon} 🎲 ${thisTurn._dices} 🎲`,
        toastStyle(thisTurn)
      );
      return;
    }

    getDiceToast(turn._dices[0], turn._dices[1], turn);
    if (turn._rolledDice) turn = checkCantMove(game, turn);

    dispatch(setThisTurn(turn.toJSON()));
  }

  function handleDiceRoll(turnJson: string) {
    const turn = ThisTurn.fromJSON(turnJson);
    oponentRolledDice(turn);
  }

  async function handleUserJoined() {
    dispatch(setIsWaitingForOpponent(false));
    const gameObj: GameObjectModel = await startGame();
    await requestStartGame(username, opponent, JSON.stringify(gameObj));
  }
  function rollDice() {
    if (thisTurn._rolledDice) {
      toast.error(
        `Play your move first
          ${thisTurn._turnPlayer._icon} 🎲 ${thisTurn._dices} 🎲`,
        toastStyle(thisTurn)
      );
      return;
    }
    var returnedThisTurn = rollingDice(thisTurn);
    if (returnedThisTurn._rolledDice)
      returnedThisTurn = checkCantMove(game, returnedThisTurn);

    requestRollDice(username, opponent, JSON.stringify(returnedThisTurn));
    dispatch(setThisTurn(returnedThisTurn.toJSON()));
  }

  function select(data: string) {
    const { newgame, turn, move } = JSON.parse(data);
    const parsedTurn: ThisTurn = ThisTurn.fromJSON(JSON.stringify(turn));
    const newTurn = new ThisTurn(
      parsedTurn._turnPlayer,
      parsedTurn._opponentPlayer,
      parsedTurn._dices,
      parsedTurn._rolledDice
    );
    dispatch(setGame(newgame));
    dispatch(setThisTurn(newTurn.toJSON()));
    dispatch(setThisMove(JSON.stringify(move)));
  }

  function turnRanOutOfTime() {
    dispatch(setIsSelecting(false));
    const newTurn = changeTurn(game, thisTurn);
    const message = `Turn is now ${thisTurn._opponentPlayer._icon}`;
    const toastMessage = JSON.stringify({ message, turn: thisTurn });
    dispatch(setThisTurn(newTurn.toJSON()));
    notifyChangeTurn(username, opponent, toastMessage);
  }

  function handleOpponentLeft(leavingUser: string) {
    if (leavingUser === opponent) {
      toast.error("Opponent left the game", toastStyle(thisTurn));
      const newGame = {
        ...game,
        _gameOn: false,
      };
      handleUserLeftGameEnd(thisTurn);
      requestEndGame(username, opponent);
      dispatch(setGame(game.toJSON()));
    }
  }

  async function handleUserSelect(index: number | string) {
    debugger;
    dispatch(setIsStartingPlayer(true));
    if (!canPlay) return;
    dispatch(setIsSelecting(true));
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
      dispatch(setIsSelecting(false));
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
        dispatch(setIsSelecting(false));
      }
      select(gameJSON);
    }
    setIsLoading(false);
  }

  function handleOpponentSelect(json: string) {
    select(json);
    const obj = JSON.parse(json);
    const newgame = Game.fromJSON(obj.newgame);
    if (newgame === null) throw new Error("Game is null");
    if (newgame._gameOn) return;
    toast("You lost!", toastStyle(thisTurn));
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
    turnRanOutOfTime,
    select,
    rollDice,
    canPlay,
    isSelecting,
    player,
    isStartingPlayer,
  };
}
