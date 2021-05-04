import { configureStore } from "@reduxjs/toolkit";

import appSlice from "./slices/appSlice";
import {socketMiddleware} from "./middlewares/socketMiddleware";

export const store = configureStore({
  reducer: {
    app: appSlice
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)
});

export default store;
