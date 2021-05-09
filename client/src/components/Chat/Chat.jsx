import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import './chat.css';

import {MemoizedChatMessages} from "./ChatMessages/ChatMessages";
import {SendMessageForm} from "./SendMessageForm/SendMessageForm";
import {InputFileModal} from "./SendMessageForm/InputFileModal/InputFIleModal";
import {useParams} from "react-router";
import {ChatHeader} from "./ChatHeader/ChatHeader";
import {NotFoundPage} from "../NotFoundPage/NotFoundPage";
import {setCurrentChatId} from "../../store/slices/chatsSlice/chatsSlice";


export const Chat = () => {
  const {chatId} = useParams();
  const dispatch = useDispatch();

  const currentChatInfo = (useSelector(state => state.chats.userChats))[chatId];
  const [isModalOpen, setModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    dispatch(setCurrentChatId(+chatId));
    return () => {
      setModalOpen(() => false);
      setInputMessage(() => '');
    };
  }, [chatId]);

  return currentChatInfo ? (
    <main className="chat-container">
      <ChatHeader
        title={currentChatInfo.chatTitle}
        isOnline={true}
      />
      <MemoizedChatMessages
        currentChatInfo={currentChatInfo}
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
