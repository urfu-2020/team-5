import {createSelector} from "@reduxjs/toolkit";

export const selectCurrentUser = state => state.user;

export const selectUserId = createSelector(
  selectCurrentUser,
  user => user.id
);

export const selectIsUserLoading = createSelector(
  selectCurrentUser,
  user => user.isUserLoading
);
