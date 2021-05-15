import {addChatMessage} from "../slices/chatsSlice/chatsSlice";
import {setCurrentUser} from "../slices/userSlice/userThunks";
import {setChatsData} from "../slices/chatsSlice/chatsThunks";


const SEND_MESSAGE = 'socket/sendMessage';
export const sendMessage = payload => ({type: SEND_MESSAGE, payload});

let socket;

const initSocket = (store, userId) => {
  socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);

  socket.onopen = function () {
    socket.send(JSON.stringify({ type: 'setUserId', payload: userId }));
  };

  socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'chatMessage': {
        store.dispatch({ type: addChatMessage.type, payload: message.payload});
        return;
      }
    }
  };
};

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case setCurrentUser.fulfilled.type: {
      if(action.payload) {
        const {id} = action.payload;
        initSocket(store, id);
      }
      return next(action);
    }

    case setChatsData.fulfilled.type: {
      const chatIds = Object.keys(action.payload);
      socket.send(JSON.stringify({ type: 'setChats', payload: chatIds}));
      return next(action);
    }

    case SEND_MESSAGE: {
      socket.send(JSON.stringify({ type: 'chatMessage', payload: action.payload }));
      return;
    }

    default: next(action);
  }
};
