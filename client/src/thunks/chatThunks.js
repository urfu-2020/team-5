import {loadOldMessages, setChatsData, setCurrentUser} from "../store/slices/appSlice";
import {config} from "../config";
import {convertRawStartChatsData} from "../utils/convertRawStartChatsData";

export const fetchStartChatsDataThunk = () => async dispatch =>  {
  const {user} = await (await fetch('/user/self')).json();
  if (user) {
    dispatch(setCurrentUser(user));
    const {rawChatsInfo, lastMessages} = await (await fetch(`/user/${user.id}/chatsData`)).json();
    const chats = convertRawStartChatsData(rawChatsInfo, lastMessages);
    dispatch(setChatsData(chats));
  }
};

export const loadOldMessagesThunk = ({chatId, offset, cbOnAllLoaded}) => async dispatch => {
  const {LOAD_MESSAGES_THRESHOLD} = config;
  const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${offset}/${LOAD_MESSAGES_THRESHOLD}`)).json();
  if (oldMessages.length < LOAD_MESSAGES_THRESHOLD) {
    cbOnAllLoaded();
  } else {
    dispatch(loadOldMessages({chatId, messages: oldMessages}));
  }
};
