import {createSlice} from '@reduxjs/toolkit';
import {setSearchResult} from "./appThunks";


class AppState {
  /**
   * @param isCreateNewChannelModalOpen {boolean}
   * @param isSearching {boolean}
   * @param error {String}
   * @param searchResult {String}
   */
  constructor(isCreateNewChannelModalOpen, isSearching, error, searchResult) {
    this.isCreateNewChannelModalOpen = isCreateNewChannelModalOpen;
    this.error = error;
    this.isSearching = isSearching;
    this.searchResult = searchResult;
  }
}


const initialAppState = {
  isCreateNewChannelModalOpen: false,
  error: null,
  isSearching: false,
  searchResult: null
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
    },
    setIsSearching(state, {payload}) {
      state.isSearching = payload;
    }
  },
  extraReducers: {
    [setSearchResult.pending]: (state) => {
      state.isSearching = true;
    },
    /**
     * Получить по строке из поиска данные о каналах с сервера
     * @param state {AppState}
     * @param payload {ChatModel}
     */
    [setSearchResult.fulfilled]: (state, {payload}) => {
      state.searchResult = payload;
    }
  }
});


const { actions, reducer } = appSlice;

export const {
  setNewChannelModalOpen,
  setError,
  setIsSearching
} = actions;

export default reducer;
