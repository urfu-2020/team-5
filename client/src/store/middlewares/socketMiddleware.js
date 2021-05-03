import { io } from "socket.io-client";


let socket;

const initSocket = (store) => {
  socket = io();
  socket.on('chatMessage', message => {
    store.dispatch({ type: 'app/addChatMessage', payload: message});
  });
};

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case 'app/setCurrentUser': {
      // socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);
      initSocket(store);
      const {Id} = action.payload;
      socket.emit('setUserId', Id);
      return next(action);
    }

    case 'app/setChatsInfo': {
      const chatIds = action.payload.map(chatInfo => chatInfo.ChatId);
      socket.emit('setChats', chatIds);
      return next(action);
    }

    case 'currentChat/sendMessage': {
      socket.emit('chatMessage', action.payload);
      return next(action);
    }



    default: next(action);
  }
};
