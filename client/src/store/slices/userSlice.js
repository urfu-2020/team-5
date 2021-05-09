import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const setCurrentUser = createAsyncThunk('user/setCurrentUser', async () => {
  const {user} = await (await fetch('/user/self')).json();
  return user;
});


const initialUserState = {
  id: null,
  username: null,
  avatarUrl: null,
  githubUrl: null,

  isUserLoading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  extraReducers: {
    [setCurrentUser.pending]: (state) => {
      state.isUserLoading = true;
    },
    /**
     * @param state {AppState}
     * @param action {{ type: string, payload: UserModel }}
     */
    [setCurrentUser.fulfilled]: (state, {payload}) => {
      state.id = payload.id;
      state.username = payload.username;
      state.avatarUrl = payload.avatarUrl;
      state.githubUrl = payload.githubUrl;

      state.isUserLoading = false;
    }
  }
});



const { reducer } = userSlice;

// export const {
//   addChatMessage,
//   setCurrentChatId,
// } = actions;

export default reducer;
