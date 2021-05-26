import {createSelector} from "@reduxjs/toolkit";


export const selectApp = state => state.app;

export const selectAppError = createSelector(
  selectApp,
  app => app.error
);


