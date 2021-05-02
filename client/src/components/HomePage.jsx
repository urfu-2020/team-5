import React from "react";
import {useSelector} from "react-redux";
import PropTypes from 'prop-types';

import {Navigation} from "./Navigation/Navigation";
import {CurrentDialog} from "./CurrentDialog/CurrentDialog";
import {SendMessageForm} from "./CurrentDialog/SendMessageForm/SendMessageForm";
import {InputFileModal} from "./CurrentDialog/SendMessageForm/InputFileModal/InputFIleModal";

export const HomePage = () => {
  const isModalOpen = useSelector(state => state.currentDialog.isModalOpen);

  return (
    <div id="app">
      <nav className="navigation">
        <Navigation />
      </nav>

      <main className="chat-container">
        <CurrentDialog />
        <SendMessageForm />
        { isModalOpen && <InputFileModal /> }
      </main>
    </div>
  );
};


