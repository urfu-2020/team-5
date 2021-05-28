import {createSelector} from "@reduxjs/toolkit";


export const selectApp = state => state.app;

export const selectAppError = createSelector(
  selectApp,
  app => app.error
);

export const selectIsCreateNewChannelModalOpen = createSelector(
  selectApp,
  app => app.isCreateNewChannelModalOpen
);
