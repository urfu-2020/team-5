import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";

import './chat.css';

import {MemoizedChatMessages} from "./ChatMessages/ChatMessages";
import {SendMessageForm} from "./SendMessageForm/SendMessageForm";
import {InputFileModal} from "./SendMessageForm/InputFileModal/InputFIleModal";
import {MemoizedChatHeader} from "./ChatHeader/ChatHeader";
import {NotFoundPage} from "../NotFoundPage/NotFoundPage";
import {setCurrentChatId} from "../../store/slices/chatsSlice/chatsSlice";
import {makeSelectCurrentChat} from "../../store/slices/chatsSlice/chatsSelectors";


export const Chat = () => {
  const chatId = +useParams().chatId;
  const dispatch = useDispatch();

  const selectCurrentChat = useMemo(makeSelectCurrentChat, []);
  const currentChat = useSelector(state => selectCurrentChat(state, chatId));

  const [isModalOpen, setModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    dispatch(setCurrentChatId(chatId));
    return () => {
      setModalOpen(() => false);
      setInputMessage(() => '');
    };
  }, [chatId]);

  return currentChat ? (
    <main className="chat-container">
      <MemoizedChatHeader
        title={currentChat.chatTitle}
        isOnline={true}
      />
      <MemoizedChatMessages
        currentChatInfo={currentChat}
        chatId={chatId}
      />
      <SendMessageForm
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
      />
      {
        isModalOpen && (
        <InputFileModal
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          setModalOpen={setModalOpen}
        />)
      }
    </main>
  ) : <NotFoundPage />;
};
