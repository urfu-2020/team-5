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

export const selectFoundMessage = createSelector(
  selectApp,
  app => app.foundMessage
);

export const selectIsDarkTheme = createSelector(
  selectApp,
  app => app.isDarkTheme
);

export const selectIsSwitching = createSelector(
  selectApp,
  app => app.isSwitching
);

export const selectIsThemeLoading = createSelector(
  selectApp,
  app => app.isThemeLoading
);

export const selectIsSideMenuOpen = createSelector(
  selectApp,
  app => app.isSideMenuOpen
);

export const selectSearchInputRef = createSelector(
  selectApp,
  app => app.searchInputRef
);
