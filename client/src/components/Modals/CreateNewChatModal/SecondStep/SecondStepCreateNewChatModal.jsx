import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import './second-step-create-new-chat-modal.css';
import {SearchIcon} from "../../../UtilComponents/Icons/SearchIcon";
import {Button} from "../../../UtilComponents/Button/Button";
import {Spinner} from "../../../UtilComponents/Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {createNewChat} from "../../../../store/middlewares/socketMiddleware";
import {selectCurrentUser} from "../../../../store/slices/userSlice/userSelectors";
import {UserCard} from "../../../UtilComponents/ChatMemberCard/UserCard";


export const SecondStepCreateNewChatModal = ({setStep, chatTitle, setNewChatModalOpen}) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUser).id;
  const [users, setUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const submitHandler = e => {
    e.preventDefault();
    dispatch(createNewChat(chatTitle, selectedUsers));
    setNewChatModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      const {contacts} = await (await fetch('/user/contacts')).json();
      setUsers(contacts);
    })();
  }, []);

  return (
    <form className="second-step-create-new-chat-modal" onSubmit={submitHandler}>
      <div className="second-step-create-new-chat-modal__head">
        <p className="second-step-create-new-chat-modal__title"> Добавить участников </p>
        <div className="second-step-create-new-chat-modal__search-panel">
          <input
            type="text"
            onChange={e => setSearchInput(e.target.value)}
            value={searchInput}
            className="create-new-chat-modal-input
            second-step-create-new-chat-modal__search-input"
          />
          <SearchIcon className="second-step-create-new-chat-modal__search-icon"/>
        </div>
      </div>

      <div className="second-step-create-new-chat-modal__users-list new-chat-user-list" >
        {
          users ?
          users.map(user => {
            if(user.id !== currentUserId && user.username.includes(searchInput)) {
              const selected = selectedUsers.find(selectedUser => selectedUser === user);

              return (
                <UserCard
                  user={user}
                  cardClassName={`new-chat-user ${selected ? 'new-chat-user_selected' : ''}`}
                  onCardClick={() => setSelectedUsers(prev => (
                    !selected ? [...prev, user] : selectedUsers.filter(selectedUser => selectedUser !== user)
                  ))}
                  iconClassName="new-chat-user__avatar"
                  usernameClassName="new-chat-user__username"
                />
              );
            }
          }) : <Spinner />
        }
      </div>

      <div className="second-step-create-new-chat-modal__buttons">
        <Button
          className="text-button"
          onClick={() => setStep(0)}
        > Назад </Button>

        <Button
          disabled={selectedUsers.length === 0}
          className="text-button"
          type="submit"
        > Создать </Button>
      </div>
    </form>
  );
};

SecondStepCreateNewChatModal.propTypes = {
  setStep: PropTypes.func,
  setNewChatModalOpen: PropTypes.func,
  chatTitle: PropTypes.string
};
