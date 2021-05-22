import {useSelector} from "react-redux";
import React, {useState} from 'react';
import PropTypes from 'prop-types';

import './side-menu.css';

import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {NewChatIcon} from "../../Controls/Icons/NewChatIcon";
import {SettingsIcon} from "../../Controls/Icons/SettingsIcon";
import {DarkModeIcon} from "../../Controls/Icons/DarkModeIcon";
import {Toggle} from "../../Controls/Toggle/Toggle";
import {CreateNewChatModal} from "../../Modals/CreateNewChatModal/CreateNewChatModal";
import {Button} from "../../Controls/Button/Button";


export const SideMenu = ({isSideMenuOpen, setOpenSideMenu}) => {
  const user = useSelector(selectCurrentUser);

  const [isCreateNewChatModalOpen, setNewChatModalOpen] = useState(false);

  const keyDownHandler = e => {
    if (e.key === 'Escape') {
      setOpenSideMenu(false);
    }
  };

  const handleOverlayClick = e => {
    if (e.target.classList.contains('modal-overlay'))
      setOpenSideMenu(false);
  };

  return (
    <>
      {
        isSideMenuOpen && (
          <div
            tabIndex="-1"
            aria-hidden="true"
            className="modal-overlay"
            onClick={handleOverlayClick}
          />
        )
      }

      <div
        role="menu"
        tabIndex="0"
        onKeyDown={keyDownHandler}
        className={`side-menu ${isSideMenuOpen ? 'side-menu_open' : 'side-menu_close'}`}
      >
        <div className="side-menu__header">
          <img className="side-menu__user-avatar" src={user.avatarUrl} alt="аватар пользователя"/>
          <p className="side-menu__user-name">{user.username}</p>
        </div>
        <div className="side-menu__main">
          <Button
            Icon={<NewChatIcon className="side-menu-option__icon"/>}
            className="button-with-pre-icon"
            onClick={() => {
              setNewChatModalOpen(true);
              setOpenSideMenu(false);
            }}
          >
            Новая группа
          </Button>

          <Button
            Icon={<SettingsIcon className="side-menu-option__icon"/>}
            className="button-with-pre-icon"
          >
            Настройки
          </Button>

          <Button
            as="label"
            htmlFor="night-mode-toggle"
            className="button-with-pre-icon night-mode-toggle-wrapper"
            Icon={<DarkModeIcon className="side-menu-option__icon"/>}
          >
            Ночной режим
            <Toggle toggleId="night-mode-toggle" className="night-mode-toggle"/>
          </Button>

        </div>
      </div>

      {
        isCreateNewChatModalOpen && <CreateNewChatModal
          isCreateNewChatModalOpen={isCreateNewChatModalOpen}
          setNewChatModalOpen={setNewChatModalOpen}
        />
      }
    </>
  );
};

SideMenu.propTypes = {
  isSideMenuOpen: PropTypes.bool,
  setOpenSideMenu: PropTypes.func
};
