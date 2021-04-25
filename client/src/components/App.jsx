import React, { Component, useState } from 'react';
import { useSelector } from 'react-redux';

import { CurrentDialog } from './CurrentDialog/CurrentDialog';
import { InputFileModal } from './CurrentDialog/SendMessageForm/InputFileModal/InputFIleModal';
import { SendMessageForm } from './CurrentDialog/SendMessageForm/SendMessageForm';

const App = () => {

  // вот это вот потом через redux делать
  const isModalOpen = useSelector(state => state.currentDialog.isModalOpen);

  return (
    <>
      <aside className="contactsListWrapper">
        {/* {{> contact_list}} */}
      </aside>

      <main className="chat-container">
        <CurrentDialog />
        <SendMessageForm />
        { isModalOpen && <InputFileModal /> }
      </main>
    </>
  );
};

export default App;
