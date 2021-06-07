import { configureStore } from "@reduxjs/toolkit";

import {socketMiddleware} from "./middlewares/socketMiddleware";
import userSlice from "./slices/userSlice/userSlice";
import chatsSlice from "./slices/chatsSlice/chatsSlice";
import appSlice from "./slices/appSlice/appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    chats: chatsSlice,
    user: userSlice
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(socketMiddleware)
});

export default store;
