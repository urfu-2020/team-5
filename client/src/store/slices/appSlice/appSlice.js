import {createSlice} from '@reduxjs/toolkit';


class AppState {
  /**
   * @param setNewChannelModalOpen {Function}
   * @param isCreateNewChannelModalOpen {boolean}
   * @param error {String}
   */
  constructor(isCreateNewChannelModalOpen, setNewChannelModalOpen, error) {
    this.isCreateNewChannelModalOpen = isCreateNewChannelModalOpen;
    this.error = error;
  }
}


const initialAppState = {
  isCreateNewChannelModalOpen: false,
  error: null
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    /**
     * @param state {AppState}
     * @param payload {boolean}
     */
    setNewChannelModalOpen(state, {payload}) {
      state.isCreateNewChannelModalOpen = payload;
    },
    /**
     * @param state {AppState}
     * @param payload {{error: boolean, errorMessage: String}}
     */
    setError(state, {payload}) {
      state.error = payload.errorMessage;
    }
  }
});


const { actions, reducer } = appSlice;

export const {
  setNewChannelModalOpen,
  setError
} = actions;

export default reducer;
