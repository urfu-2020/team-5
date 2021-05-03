import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
  currentUser: null,
  chatsInfo: [],
  chatsMessages: {}
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setCurrentUser(state, {payload}) {
      state.currentUser = payload;
    },
    setChatsInfo(state, {payload}) {
      state.chatsInfo = payload;
    },
    setChatsMessages(state, {payload}) {
      state.chatsMessages = payload;
    },
    setLoading(state, {payload}) {
      state.isLoading = payload;
    }
  }
});

const { actions, reducer } = appSlice;

export const { setCurrentUser, setChatsInfo, setChatsMessages, setLoading } = actions;

export default reducer;
