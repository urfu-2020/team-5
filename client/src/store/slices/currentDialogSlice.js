import {createSlice} from '@reduxjs/toolkit';


const initialState = {
  message: '',
  isModalOpen: false
};

export const currentDialogSlice = createSlice({
  name: "currentDialog",
  initialState: initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    setInputMessage(state, action) {
      state.message = action.payload;
    }
  }
});

const { actions, reducer } = currentDialogSlice;

export const { openModal, closeModal, setInputMessage } = actions;

export default reducer;
