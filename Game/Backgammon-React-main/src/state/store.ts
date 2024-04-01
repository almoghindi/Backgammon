import { configureStore } from "@reduxjs/toolkit";
import PlayerSlice from "./slices/playerSlice";
import GameSlice from "./slices/gameSlice";

const store = configureStore({
  reducer: {
    player: PlayerSlice,
    game: GameSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatcher = typeof store.dispatch;

export default store;
