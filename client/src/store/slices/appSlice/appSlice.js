import {createSlice} from '@reduxjs/toolkit';
import {setSearchResult} from "./appThunks";

class AppState {
  /**
   * @param isCreateNewChannelModalOpen {boolean}
   * @param isSearching {boolean}
   * @param error {String}
   * @param searchResult {{channels: Array<ChatModel>, messages: Array<MessageModel>}}
   * @param foundMessage {MessageModel}
   * @param isDarkTheme {boolean}
   */
  constructor(isCreateNewChannelModalOpen, isSearching, error
              , searchResult, foundMessage, isDarkTheme) {
    this.isCreateNewChannelModalOpen = isCreateNewChannelModalOpen;
    this.error = error;
    this.isSearching = isSearching;
    this.searchResult = searchResult;
    this.foundMessage = foundMessage;
    this.isDarkTheme = isDarkTheme;
  }
}


const initialAppState = {
  isCreateNewChannelModalOpen: false,
  error: null,

  isSearching: false,
  searchResult: null,
  foundMessage: null,
  isDarkTheme: false
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
    },
    /**
     * При клике в боковом меню на найденное сообщение прокидывать его в редакс, чтобы в чатике проскролить к нему
     * @param state {AppState}
     * @param payload {MessageModel}
     */
    setFoundMessage(state, {payload}) {
      state.foundMessage = null;
      state.foundMessage = payload;
    },
    setIsDarkTheme(state, {payload}) {
      state.isDarkTheme = payload;
    }
  },
  extraReducers: {
    [setSearchResult.pending]: (state) => {
      state.isSearching = true;
    },
    /**
     * Получить по строке из поиска данные о каналах с сервера
     * @param state {AppState}
     * @param payload {{channels: Array<ChatModel>, messages: Array<MessageModel>}}
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
  setIsSearching,
  setFoundMessage,
  setIsDarkTheme
} = actions;

export default reducer;
