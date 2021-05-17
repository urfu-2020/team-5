import {addChatMessage, addNewChat, setChatsData} from "../slices/chatsSlice/chatsSlice";
import {convertRawNewDialog} from "../../utils/chatConverters";

const INIT_SOCKET = 'socket/init';
export const initSocket = () => ({type: INIT_SOCKET});
const ADD_DIALOGS_WITH_NEW_USER = 'socket/addDialogsWithNewUser';
export const addDialogsWithNewUser = () => ({ type: ADD_DIALOGS_WITH_NEW_USER });
const SEND_MESSAGE = 'socket/sendMessage';
export const sendMessage = payload => ({type: SEND_MESSAGE, payload});

let socket;

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case INIT_SOCKET: {
      socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);

      socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        switch (message.type) {
          case 'setChatsData': {
            store.dispatch({type: setChatsData.type, payload: message.payload});
            break;
          }
          case 'addNewDialog': {
            store.dispatch({type: addNewChat.type, payload: message.payload});
            break;
          }
          case 'chatMessage': {
            store.dispatch({type: addChatMessage.type, payload: message.payload});
            break;
          }
        }
      };
      break;
    }

    // case ADD_DIALOGS_WITH_NEW_USER: {
    //   socket.send(JSON.stringify({type: 'addDialogsWithNewUser'}));
    //   break;
    // }

    case SEND_MESSAGE: {
      socket.send(JSON.stringify({type: 'chatMessage', payload: action.payload}));
      break;
    }

    default:
      next(action);
  }
};
