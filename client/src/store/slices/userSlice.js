import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const setCurrentUser = createAsyncThunk('user/setCurrentUser', async () => {
  const {user} = await (await fetch('/user/self')).json();
  return user;
});

class UserState {
  /**
   *
   * @param id {number}
   * @param username {string}
   * @param avatarUrl {string}
   * @param githubUrl {string}
   * @param isUserLoading {boolean}
   */
  constructor(id,
              username,
              avatarUrl,
              githubUrl,
              isUserLoading) {
    this.id = id;
    this.username = username;
    this.avatarUrl = avatarUrl;
    this.githubUrl = githubUrl;
    this.isUserLoading = isUserLoading;
  }
}


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
     * @param state {UserState}
     * @param action {{ type: string, payload: UserModel }}
     */
    [setCurrentUser.fulfilled]: (state, {payload}) => {
      if(payload) {
        state.id = payload.id;
        state.username = payload.username;
        state.avatarUrl = payload.avatarUrl;
        state.githubUrl = payload.githubUrl;
      }

      state.isUserLoading = false;
    }
  }
});


const {reducer} = userSlice;

export default reducer;
