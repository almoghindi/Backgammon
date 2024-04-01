import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Game from "../../logic/models/game";
import ThisTurn from "../../logic/models/this-turn";
import ThisMove from "../../logic/models/this-move";

interface GameState {
  game: string;
  thisTurn: string;
  thisMove: string;
}

const initialState: GameState = {
  game: Game.new().toJSON(),
  thisTurn: ThisTurn.new().toJSON(),
  thisMove: JSON.stringify(ThisMove.new()),
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<string>) => {
      state.game = action.payload;
    },
    setThisTurn: (state, action: PayloadAction<string>) => {
      state.thisTurn = action.payload;
    },
    setThisMove: (state, action: PayloadAction<string>) => {
      state.thisMove = action.payload;
    },
  },
});

export const { setGame, setThisTurn, setThisMove } = gameSlice.actions;

export default gameSlice.reducer;
