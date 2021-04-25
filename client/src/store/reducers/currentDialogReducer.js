// action types
const OPEN_FILE_INPUT_MODAL = 'OPEN_FILE_INPUT_MODAL';
const CLOSE_FILE_INPUT_MODAL = 'CLOSE_FILE_INPUT_MODAL';
const SET_INPUT_MESSAGE = 'SET_INPUT_MESSAGE';

// reducer
const initialState = {
  message: '',
  isModalOpen: false
};

export const currentDialogReducer = (state = initialState, action) => {
  switch(action.type) {
    case OPEN_FILE_INPUT_MODAL: {
      return {
        ...state,
        isModalOpen: true
      };
    }

    case CLOSE_FILE_INPUT_MODAL: {
      return {
        ...state,
        isModalOpen: false
      };
    }

    case SET_INPUT_MESSAGE: {
      return {
        ...state,
        message: action.payload
      };
    }

    default: return state;
  }
};


// action creators
export const openModal = () => ({type: OPEN_FILE_INPUT_MODAL});
export const closeModal = () => ({type: CLOSE_FILE_INPUT_MODAL});
export const setInputMessage = message => ({type: SET_INPUT_MESSAGE, payload: message});
