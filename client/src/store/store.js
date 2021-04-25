import { configureStore } from "@reduxjs/toolkit";

import currentDialogSlice from '@slices/currentDialogSlice';


export const store = configureStore({
  reducer: {
    currentDialog: currentDialogSlice
  },
  devTools: process.env.NODE_ENV === 'development'
});

export default store;
