import React, { Component, useState } from 'react';

import { CurrentDialog } from './CurrentDialog/CurrentDialog';
import { SendMessageForm } from './CurrentDialog/SendMessageForm/SendMessageForm';

// надо засунуть сюда редакс чтобы при нажатии
// диспатчился экшн открытия модалки и соотв при закрытии экшн закрытия
const App = () => (
  <>
    <aside className="contactsListWrapper">
      {/* {{> contact_list}} */}
    </aside>

    <main className="chat-container">
      <CurrentDialog />
      <SendMessageForm />
      {/* {{> input_file_modal }} */}
    </main>
  </>
);
export default App;
