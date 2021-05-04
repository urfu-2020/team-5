import React, {useEffect, useState} from "react";

import './chat.css';

import {MemoizedChatMessages} from "./ChatMessages/ChatMessages";
import {SendMessageForm} from "./SendMessageForm/SendMessageForm";
import {InputFileModal} from "./SendMessageForm/InputFileModal/InputFIleModal";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import {setCurrentChatId} from "../../store/slices/appSlice";


export const Chat = () => {
  const {chatId} = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentChatId(+chatId));
    return () => {
      setModalOpen(() => false);
      setInputMessage(() => '');
    };
  }, [chatId]);

  return (
    <main className="chat-container">
      <MemoizedChatMessages chatId={+chatId} />
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
  );
};
