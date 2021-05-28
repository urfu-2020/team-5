import {addChatMessage, addNewChat, setChatsData} from "../slices/chatsSlice/chatsSlice";
import {setError} from "../slices/appSlice/appSlice";
import {CREATE_NEW_CHANNEL, CREATE_NEW_CHAT, INIT_SOCKET, SEND_MESSAGE} from "./socketReduxActions";

let socket;

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case INIT_SOCKET: {
      socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);
      socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'ping': {
            socket.send(JSON.stringify({type: 'pong'}));
            break;
          }
          case 'setChatsData': {
            store.dispatch({type: setChatsData.type, payload: message.payload});
            break;
          }
          case 'addNewChat': {
            store.dispatch({type: addNewChat.type, payload: message.payload});
            break;
          }
          case 'chatMessage': {
            store.dispatch({type: addChatMessage.type, payload: message.payload});
            break;
          }
          case 'errorMessage': {
            store.dispatch({type: setError.type, payload: message.payload});
            break;
          }
        }
      };
      break;
    }

    case CREATE_NEW_CHAT: {
      socket.send(JSON.stringify({type: 'createNewChat', payload: action.payload }));
      break;
    }

    case CREATE_NEW_CHANNEL: {
      socket.send(JSON.stringify({type: 'createNewChannel', payload: action.payload }));
      break;
    }

    case SEND_MESSAGE: {
      socket.send(JSON.stringify({type: 'chatMessage', payload: action.payload}));
      break;
    }

    default:
      next(action);
  }
};
