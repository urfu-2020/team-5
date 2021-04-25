import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuth: false
};

export const currentDialogSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
    }
  }
});

const { actions, reducer } = currentDialogSlice;

export const { login, logout } = actions;

export default reducer;
