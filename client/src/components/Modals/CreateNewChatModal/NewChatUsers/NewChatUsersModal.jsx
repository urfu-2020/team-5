import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';

import './new-chat-users-modal.css';
import {Button} from "../../../UtilComponents/Button/Button";
import {Spinner} from "../../../UtilComponents/Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentUser} from "../../../../store/slices/userSlice/userSelectors";
import {CloseIcon} from "../../../UtilComponents/Icons/CloseIcon";
import {Modal} from "../../ModalBase/Modal";
import {createNewChat} from "../../../../store/middlewares/socketReduxActions";
import {BaseInput} from "../../../UtilComponents/Inputs/BaseInput/BaseInput";
import {selectIsDarkTheme} from "../../../../store/slices/appSlice/appSelectors";


export const NewChatUsersModal = ({
                                    setStep,
                                    chatTitle,
                                    setNewChatModalOpen
                                  }) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUser).id;
  const isDarkTheme = useSelector(selectIsDarkTheme);

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
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <Modal
      as="form"
      onOverlayClick={() => setNewChatModalOpen(false)}
      className={`new-chat-user-modal ${isDarkTheme ? 'new-chat-user-modal_dark' : ''}`}
      onSubmit={submitHandler}
      role="dialog"
      aria-label="Модальное окно создания чата, 2 этап."
    >
      <Button
        onClick={() => setNewChatModalOpen(false)}
        className="rounded-button centred-button create-chat-modal__close-icon"
        Icon={<CloseIcon className="svg-button"/>}
      />
      <div className="new-chat-user-modal__head">
        <h3 className="new-chat-user-modal__title"> Добавить участников </h3>
        <div className="new-chat-user-modal__search-panel">
          <BaseInput
            type="text"
            onChange={e => setSearchInput(e.target.value)}
            value={searchInput}
            className="create-new-chat-modal-input
            new-chat-user-modal__search-input"
            aria-label="Поиск участников"
            placeholder="Введите имя пользователя"
          />
        </div>
      </div>

      <ul
        aria-label="Список контактов"
        className="new-chat-user-modal__users-list new-chat-user-list"
      >
        {
          users ?
            users.map(user => {
              if (user.id !== currentUserId && user.username.includes(searchInput)) {
                const selected = selectedUsers.find(selectedUser => selectedUser === user);

                return (
                  <Button
                    key={user.id}
                    onClick={() => setSelectedUsers(prev => (
                      !selected ? [...prev, user] : selectedUsers.filter(selectedUser => selectedUser !== user)
                    ))}
                    className={`new-chat-user button-with-pre-icon ${selected ? 'new-chat-user_selected' : ''}`}
                    Icon={<img className="new-chat-user__avatar" src={user.avatarUrl} alt="user avatar" />}
                    role="listitem"
                  >
                    <p className={"new-chat-user__username"}>{user.username}</p>
                  </Button>
                );
              }
            }) : <Spinner/>
        }
      </ul>

      <div className="new-chat-user-modal__buttons">
        <Button
          aria-label="Вернуться на предыдущий этап"
          className="text-button"
          onClick={() => setStep(0)}
        > Назад </Button>

        <Button
          aria-label="Создать чат"
          disabled={selectedUsers.length === 0}
          className="text-button"
          type="submit"
        > Создать </Button>
      </div>
    </Modal>
  );
};

NewChatUsersModal.propTypes = {
  setStep: PropTypes.func,
  setNewChatModalOpen: PropTypes.func,
  chatTitle: PropTypes.string
};
