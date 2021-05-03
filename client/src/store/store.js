import { configureStore } from "@reduxjs/toolkit";

import currentChatSlice from "./slices/currentChatSlice";
import appSlice from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    currentChat: currentChatSlice
  },
  devTools: process.env.NODE_ENV === 'development'
});

export default store;
