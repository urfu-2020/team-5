import {createSlice} from '@reduxjs/toolkit';


const initialState = {
  id: null,
  message: '',
  isModalOpen: false
};

export const currentChatSlice = createSlice({
  name: "currentChat",
  initialState: initialState,
  reducers: {
    openNewCurrentChat(state, {payload}) {
      return  {...initialState, id: payload};
    },
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setInputMessage(state, {payload}) {
      state.message = payload;
    }
  }
});

const { actions, reducer } = currentChatSlice;

export const { openNewCurrentChat, openModal, closeModal, setInputMessage } = actions;

export default reducer;
