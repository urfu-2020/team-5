import {createSlice} from '@reduxjs/toolkit';


class AppState {
  /**
   *
   * @param error {String}
   */
  constructor(error) {
    this.error = error;
  }
}


const initialAppState = {
  error: null
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setError(state, {payload}) {
      console.log(payload);
      state.error = payload.errorMessage;
    }
  }
});


const { actions, reducer } = appSlice;

export const {
  setError
} = actions;

export default reducer;
