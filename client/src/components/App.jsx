import React, { Component, useState } from 'react';

import { CurrentDialog } from './CurrentDialog/CurrentDialog';
import { InputFileModal } from './CurrentDialog/SendMessageForm/InputFileModal/InputFIleModal';
import { SendMessageForm } from './CurrentDialog/SendMessageForm/SendMessageForm';

const App = () => {

  // вот это вот потом через redux делать
  const [isModalOpen, setOpenModal] = useState(false);

  return (
    <>
      <aside className="contactsListWrapper">
        {/* {{> contact_list}} */}
      </aside>

      <main className="chat-container">
        <CurrentDialog />
        <SendMessageForm setOpenModal={setOpenModal} />
        { isModalOpen && <InputFileModal setOpenModal={setOpenModal} /> }
      </main>
    </>
  );
};

export default App;
