import {createSlice} from '@reduxjs/toolkit';
import {setSearchResult, setTheme} from "./appThunks";

export const tabTypes = {
  Chats: 'Chats',
  Channels: 'Channels'
};

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
   * @param isSideMenuOpen {boolean}
   * @param selectedTab {tabTypes.Chats | tabTypes.Channels}
   */
  constructor(isCreateNewChannelModalOpen, isSearching, error, isSideMenuOpen,
              searchResult, foundMessage, isDarkTheme,
              isSwitching, isThemeLoading, selectedTab) {
    this.isCreateNewChannelModalOpen = isCreateNewChannelModalOpen;
    this.error = error;
    this.isSearching = isSearching;
    this.searchResult = searchResult;
    this.foundMessage = foundMessage;
    this.isDarkTheme = isDarkTheme;
    this.isSwitching = isSwitching;
    this.isThemeLoading = isThemeLoading;
    this.isSideMenuOpen = isSideMenuOpen;
    this.selectedTab = selectedTab;
  }
}


const initialAppState = {
  isCreateNewChannelModalOpen: false,
  error: null,
  isSideMenuOpen: false,
  isSearching: false,
  searchResult: null,
  foundMessage: null,
  isDarkTheme: false,
  isSwitching: false,
  isThemeLoading: true,
  selectedTab: tabTypes.Chats
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
      if(payload)
        state.error = payload.errorMessage;
      else state.error = null;
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
    },
    setIsSideMenuOpen(state, {payload}) {
      state.isSideMenuOpen = payload;
    },
    setSelectedTab(state, {payload}) {
      state.selectedTab = payload;
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
  setStartTheme,
  setIsSideMenuOpen,
  setSelectedTab
} = actions;

export default reducer;
