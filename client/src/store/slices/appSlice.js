import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
  currentUser: null,
  contacts: []
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setCurrentUser(state, {payload}) {
      state.currentUser = payload;
    },
    setContacts(state, {payload}) {
      state.contacts = payload;
    },
    setLoading(state, {payload}) {
      state.isLoading = payload;
    }
  }
});

const { actions, reducer } = appSlice;

export const { setCurrentUser, setContacts, setLoading } = actions;

export default reducer;
