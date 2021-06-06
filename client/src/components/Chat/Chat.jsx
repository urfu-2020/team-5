import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";

import './chat.css';

import {MemoizedChatMessages} from "./ChatMessages/ChatMessages";
import {SendMessageForm} from "./SendMessageForm/SendMessageForm";
import {InputFileModal} from "../Modals/InputFileModal/InputFIleModal";
import {MemoizedChatHeader} from "./ChatHeader/ChatHeader";
import {setCurrentChat} from "../../store/slices/chatsSlice/chatsSlice";
import {selectCurrentChat, selectIsChatsDataLoading} from "../../store/slices/chatsSlice/chatsSelectors";
import {selectCurrentUser} from "../../store/slices/userSlice/userSelectors";
import {setUnsubscribedChannel} from "../../store/middlewares/socketReduxActions";
import {ChannelButton} from "./ChannelButton/ChannelButton";
import {selectIsDarkTheme} from "../../store/slices/appSlice/appSelectors";


export const Chat = () => {
  const chatId = +useParams().chatId;
  const dispatch = useDispatch();

  const isChatsDataLoading = useSelector(selectIsChatsDataLoading);
  const currentUser = useSelector(selectCurrentUser);
  const currentChat = useSelector(selectCurrentChat);
  const isDarkTheme = useSelector(selectIsDarkTheme);

  const [isInputFileModalOpen, setInputFileModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  // state для попытки установки чатика из редакса, если true - значит пробовали установить
  const [isSetSubscribedChat, setIsSetSubscribedChat] = useState(false);

  // сначала пытаемся достать чат из редакса
  useEffect(() => {
    if(!isChatsDataLoading && chatId) {
      dispatch(setCurrentChat(chatId));
      if(!isSetSubscribedChat)
        setIsSetSubscribedChat(true);
    }
    return () => {
      setInputFileModalOpen(() => false);
      setInputMessage(() => '');
    };
  }, [isChatsDataLoading, chatId]);

  // если его нет в редаксе, то это мб канал и его нужно отобразить
  useEffect(() => {
    if (chatId && isSetSubscribedChat && !currentChat) {
      dispatch(setUnsubscribedChannel(chatId));
    }
  }, [chatId, currentChat, isSetSubscribedChat]);

  return currentChat ? (
    <main className={`chat-container ${isDarkTheme ? 'chat-container_dark' : ''}`}>
      <MemoizedChatHeader
        currentChat={currentChat}
        isOnline={true}
      />
      <MemoizedChatMessages
        currentChat={currentChat}
      />
      {
        currentChat.chatType !== "Channel" ||
        (currentChat.chatType === "Channel" && currentChat.owner.id === currentUser.id) ? (
          <>
            <SendMessageForm
              currentChat={currentChat}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              isInputFileModalOpen={isInputFileModalOpen}
              setInputFileModalOpen={setInputFileModalOpen}
            />
            {
              isInputFileModalOpen && (
                <InputFileModal
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  setLoadFileModalOpen={setInputFileModalOpen}
                />)
            }
          </>
        ) : (
          <ChannelButton channelId={chatId} />
        )
      }

    </main>
  ) : null;
};
