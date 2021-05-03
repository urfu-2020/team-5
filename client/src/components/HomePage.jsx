import React from "react";
import {useSelector} from "react-redux";

import {Navigation} from "./Navigation/Navigation";
import {CurrentChat} from "./CurrentChat/CurrentChat";
import {SendMessageForm} from "./CurrentChat/SendMessageForm/SendMessageForm";
import {InputFileModal} from "./CurrentChat/SendMessageForm/InputFileModal/InputFIleModal";

export const HomePage = () => {
  const isModalOpen = useSelector(state => state.currentChat.isModalOpen);

  return (
    <div id="app">
      <nav className="navigation">
        <Navigation />
      </nav>

      <main className="chat-container">
        <CurrentChat />
        <SendMessageForm />
        { isModalOpen && <InputFileModal /> }
      </main>
    </div>
  );
};



