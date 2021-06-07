import {
  addChatMessage,
  addNewChat, leaveFromChat,
  setChatsData,
  setCurrentUnsubscribeChannel, setIsSubscribing
} from "../slices/chatsSlice/chatsSlice";
import {setError, setStartTheme} from "../slices/appSlice/appSlice";
import {
  CREATE_NEW_CHANNEL,
  CREATE_NEW_CHAT,
  INIT_SOCKET, SUBSCRIBE_TO_CHANNEL,
  SEND_MESSAGE,
  SET_UNSUBSCRIBED_CHANNEL, UNSUBSCRIBE_FROM_CHANNEL
} from "./socketReduxActions";

let socket;

function connect(store) {
  socket = new WebSocket(process.env.REACT_APP_BACKEND_WEBSOCKET_URL);
  if(store.getState().app.error) {
    store.dispatch(setError(null));
  }
  socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    const {payload} = message;
    switch (message.type) {
      case 'ping': {
        socket.send(JSON.stringify({type: 'pong'}));
        break;
      }
      case 'setChatsData': {
        store.dispatch(setChatsData(payload));
        break;
      }
      case 'setTheme': {
        store.dispatch(setStartTheme(payload));
        break;
      }
      case 'addNewChat': {
        store.dispatch(addNewChat(payload));
        break;
      }
      case 'subscribeToChannel': {
        store.dispatch(addNewChat(payload));
        store.dispatch(setIsSubscribing(false));
        break;
      }
      case 'unsubscribeFromChannel': {
        store.dispatch(leaveFromChat(payload));
        store.dispatch(setIsSubscribing(false));
        break;
      }
      case 'chatMessage': {
        store.dispatch(addChatMessage(payload));
        break;
      }
      case 'errorMessage': {
        store.dispatch(setError(payload));
        break;
      }
      case 'setUnsubscribedChannel': {
        store.dispatch(setCurrentUnsubscribeChannel(payload));
        break;
      }
    }
  };

  socket.onclose = function() {
    store.dispatch(setError({ error: true,
      errorMessage: "Соеденение прервано. Повторное подключение..."}));
    setTimeout(function() {
      connect();
    }, 1000);
  };

  socket.onerror = function() {
    store.dispatch(setError({ error: true,
      errorMessage: "Ошибка соеденения. Перезагрузите страницу."}));
    socket.close();
  };
}

export const socketMiddleware = store => next => action => {
  switch (action.type) {
    case INIT_SOCKET: {
      connect(store);
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

    case SET_UNSUBSCRIBED_CHANNEL: {
      socket.send(JSON.stringify({type: 'setUnsubscribedChannel', payload: action.payload }));
      break;
    }

    case SUBSCRIBE_TO_CHANNEL: {
      socket.send(JSON.stringify({type: 'subscribeToChannel', payload: action.payload }));
      break;
    }

    case UNSUBSCRIBE_FROM_CHANNEL: {
      socket.send(JSON.stringify({type: 'unsubscribeFromChannel', payload: action.payload }));
      break;
    }

    default:
      next(action);
  }
};
