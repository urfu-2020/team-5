import { io } from "socket.io-client";
import {addChatMessage, setChatsData, setCurrentUser} from "../slices/appSlice";

const SEND_MESSAGE = 'socket/sendMessage';
export const sendMessage = payload => ({type: SEND_MESSAGE, payload});

let socket;

const initSocket = (store) => {
  socket = io();
  console.log('init socket');
  socket.on('chatMessage', message => {
    console.log('chat message', message);
    store.dispatch({ type: addChatMessage.type, payload: message});
  });
};

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case setCurrentUser.type: {
      // socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);
      initSocket(store);
      const {id} = action.payload;
      socket.emit('setUserId', id);
      return next(action);
    }

    case setChatsData.type: {
      const chatIds = Object.keys(action.payload);
      socket.emit('setChats', chatIds);
      return next(action);
    }

    case SEND_MESSAGE: {
      socket.emit('chatMessage', action.payload);
      return;
    }

    default: next(action);
  }
};