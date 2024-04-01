import { createSlice } from "@reduxjs/toolkit";

export interface PlayerState {
  player: string | null;
  isWaitingForOpponent: boolean;
  isStartingPlayer: boolean;
  isSelecting: boolean;
}

const initialState: PlayerState = {
  player: "",
  isWaitingForOpponent: true,
  isStartingPlayer: false,
  isSelecting: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action) => {
      state.player = action.payload;
    },
    setIsWaitingForOpponent: (state, action) => {
      state.isWaitingForOpponent = action.payload;
    },
    setIsStartingPlayer: (state, action) => {
      state.isStartingPlayer = action.payload;
    },
    setIsSelecting: (state, action) => {
      state.isSelecting = action.payload;
    },
  },
});

export const {
  setPlayer,
  setIsSelecting,
  setIsStartingPlayer,
  setIsWaitingForOpponent,
} = playerSlice.actions;
export default playerSlice.reducer;
