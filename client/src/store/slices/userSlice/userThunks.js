import {createAsyncThunk} from "@reduxjs/toolkit";

export const setCurrentUser = createAsyncThunk('user/setCurrentUser', async () => {
  const {user} = await (await fetch('/user/self')).json();
  return user;
});
