import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import currentDialogSlice from "./slices/currentDialogSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    currentDialog: currentDialogSlice
  },
  devTools: process.env.NODE_ENV === 'development'
});

export default store;
