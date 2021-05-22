import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import './second-step-create-new-chat-modal.css';
import {SearchIcon} from "../../../Controls/Icons/SearchIcon";
import {Button} from "../../../Controls/Button/Button";
import {Spinner} from "../../../Controls/Spinner/Spinner";

export const SecondStepCreateNewChatModal = ({setStep, chatTitle}) => {
  const [users, setUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const {contacts} = await (await fetch('/user/contacts')).json();
      setUsers(contacts);
    })();
  }, []);

  return !users ? <Spinner /> : (
    <div className="second-step-create-new-chat-modal">
      <div className="second-step-create-new-chat-modal__head">
        <h3> Add Members </h3>
        <div className="second-step-create-new-chat-modal__search-panel">
          <input type="text" className="second-step-create-new-chat-modal__search-input" />
          <SearchIcon className="second-step-create-new-chat-modal__search-icon"/>
        </div>
      </div>

      <div className="second-step-create-new-chat-modal__users-list new-chat-user-list" >
        {
          users.map(user => {
            const selected = selectedUsers.find(selectedUser => selectedUser === user);
            return (
              <Button
                onClick={() => setSelectedUsers(prev => (
                  !selected ? [...prev, user] : selectedUsers.filter(selectedUser => selectedUser !== user)
                ))}
                className={
                  `button-with-pre-icon new-chat-user ${selected ? 'new-chat-user_selected' : ''}`
                }
                key={user.id}
                Icon={<img className="new-chat-user__avatar" src={user.avatarUrl} alt="user avatar" />}
              >
                <p className="new-chat-user__username">{user.username}</p>
              </Button>
            );
          })
        }
      </div>

      <div className="second-step-create-new-chat-modal__buttons">
        <Button
          className="text-button"
          onClick={() => setStep(0)}
        > Назад </Button>
        <Button className="text-button"> Создать </Button>
      </div>
    </div>
  );
};

SecondStepCreateNewChatModal.propTypes = {
  setStep: PropTypes.func,
  chatTitle: PropTypes.string
};
