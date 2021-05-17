import {addChatMessage, setChatsData} from "../slices/chatsSlice/chatsSlice";
import {setCurrentUser} from "../slices/userSlice/userThunks";
import {convertRawStartChatsData} from "../../utils/convertRawStartChatsData";


const SEND_MESSAGE = 'socket/sendMessage';
export const sendMessage = payload => ({type: SEND_MESSAGE, payload});

let socket;

const initSocket = (store) => {
  socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);

  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case 'setChatsData': {
        const {rawChatsInfo, lastMessages} = message.payload;
        store.dispatch({type: setChatsData.type, payload: convertRawStartChatsData(rawChatsInfo, lastMessages)});
        return;
      }
      case 'chatMessage': {
        store.dispatch({type: addChatMessage.type, payload: message.payload});
        return;
      }
    }
  };
};

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case setCurrentUser.fulfilled.type: {
      if (action.payload) {
        initSocket(store);
      }
      return next(action);
    }

    case SEND_MESSAGE: {
      socket.send(JSON.stringify({type: 'chatMessage', payload: action.payload}));
      return;
    }

    default:
      next(action);
  }
};
