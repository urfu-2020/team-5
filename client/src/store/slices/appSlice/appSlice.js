import {createSlice} from '@reduxjs/toolkit';
import {setSearchResult, setTheme} from "./appThunks";

class AppState {
  /**
   * @param isCreateNewChannelModalOpen {boolean}
   * @param isSearching {boolean}
   * @param error {String}
   * @param searchResult {{channels: Array<ChatModel>, messages: Array<MessageModel>}}
   * @param foundMessage {MessageModel}
   * @param isDarkTheme {boolean}
   * @param isSwitching {boolean}
   * @param isThemeLoading {boolean}
   */
  constructor(isCreateNewChannelModalOpen, isSearching, error
              , searchResult, foundMessage, isDarkTheme,
              isSwitching, isThemeLoading) {
    this.isCreateNewChannelModalOpen = isCreateNewChannelModalOpen;
    this.error = error;
    this.isSearching = isSearching;
    this.searchResult = searchResult;
    this.foundMessage = foundMessage;
    this.isDarkTheme = isDarkTheme;
    this.isSwitching = isSwitching;
    this.isThemeLoading = isThemeLoading;
  }
}


const initialAppState = {
  isCreateNewChannelModalOpen: false,
  error: null,

  isSearching: false,
  searchResult: null,
  foundMessage: null,
  isDarkTheme: false,
  isSwitching: false,
  isThemeLoading: true
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
    setStartTheme(state, {payload}) {
      state.isDarkTheme = payload;
      state.isThemeLoading = false;
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
    },
    [setTheme.pending]: (state) => {
      state.isSwitching = true;
    },
    [setTheme.fulfilled]: (state) => {
      state.isSwitching = false;
      state.isDarkTheme = !state.isDarkTheme;
    }
  }
});


const { actions, reducer } = appSlice;

export const {
  setNewChannelModalOpen,
  setError,
  setIsSearching,
  setFoundMessage,
  setStartTheme
} = actions;

export default reducer;
