import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import threadReducer from "./thread/thread.slice";
import likeReducer from "./like/like.slice";
import followsReducer from "./follows/follow.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    likes: likeReducer,
    follows: followsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
