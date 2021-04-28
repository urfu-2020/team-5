import { configureStore } from "@reduxjs/toolkit";

import currentDialogSlice from "./slices/currentDialogSlice";
import appSlice from "./slices/appSlice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    currentDialog: currentDialogSlice
  },
  devTools: process.env.NODE_ENV === 'development'
});

export default store;
