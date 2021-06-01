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

export const selectIsSearching = createSelector(
  selectApp,
  app => app.isSearching
);

export const selectSearchResult = createSelector(
  selectApp,
  app => app.searchResult
);
