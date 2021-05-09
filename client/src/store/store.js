import { configureStore } from "@reduxjs/toolkit";

import {socketMiddleware} from "./middlewares/socketMiddleware";
import userSlice from "./slices/userSlice";
import chatsSlice from "./slices/chatsSlice";

export const store = configureStore({
  reducer: {
    chats: chatsSlice,
    user: userSlice
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)
});

export default store;
