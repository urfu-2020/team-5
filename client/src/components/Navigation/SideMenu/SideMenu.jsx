import {useDispatch, useSelector} from "react-redux";
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';

import './side-menu.css';

import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {NewChatIcon} from "../../UtilComponents/Icons/NewChatIcon";
import {SettingsIcon} from "../../UtilComponents/Icons/SettingsIcon";
import {DarkModeIcon} from "../../UtilComponents/Icons/DarkModeIcon";
import {Toggle} from "../../UtilComponents/Toggle/Toggle";
import {CreateNewChatModal} from "../../Modals/CreateNewChatModal/CreateNewChatModal";
import {Button} from "../../UtilComponents/Button/Button";
import {NewChannelIcon} from "../../UtilComponents/Icons/NewChannelIcon";
import {CreateNewChannelModal} from "../../Modals/CreateNewChannelModal/CreateNewChannelModal";
import {
  selectIsCreateNewChannelModalOpen
} from "../../../store/slices/appSlice/appSelectors";
import {Overlay} from "../../UtilComponents/Overlay/Overlay";
import {setNewChannelModalOpen} from "../../../store/slices/appSlice/appSlice";

export const SideMenu = ({isSideMenuOpen, setOpenSideMenu}) => {
  const user = useSelector(selectCurrentUser);
  const isCreateNewChannelModalOpen = useSelector(selectIsCreateNewChannelModalOpen);

  const dispatch = useDispatch();

  const [isCreateNewChatModalOpen, setNewChatModalOpen] = useState(false);

  const keyDownHandler = e => {
    if (e.key === 'Escape') {
      setOpenSideMenu(false);
    }
  };

  return (
    <>
      {
        isSideMenuOpen && <Overlay onClick={() => setOpenSideMenu(false)} />
      }

      <FocusLock disabled={!isSideMenuOpen}>
        <div
          role="menu"
          tabIndex={isSideMenuOpen ? '0' : '-1'}
          aria-hidden={!isSideMenuOpen}
          onKeyDown={keyDownHandler}
          className={`side-menu ${isSideMenuOpen ? 'side-menu_open' : 'side-menu_close'}`}
        >
          <div className="side-menu__header">
            <img className="side-menu__user-avatar" src={user.avatarUrl} alt="аватар пользователя"/>
            <p className="side-menu__user-name">{user.username}</p>
          </div>
          <ul className="side-menu__main">
            <Button
              aria-label="Новая группа"
              tabIndex={isSideMenuOpen ? '0' : '-1'}
              Icon={<NewChatIcon className="side-menu-option__icon"/>}
              className="centred-button button-with-pre-icon"
              onClick={() => {
                setNewChatModalOpen(true);
                setOpenSideMenu(false);
              }}
            >
              Новая группа
            </Button>

            <Button
              aria-label="Новый канал"
              tabIndex={isSideMenuOpen ? '0' : '-1'}
              Icon={<NewChannelIcon className="side-menu-option__icon"/>}
              className="centred-button button-with-pre-icon"
              onClick={() => {
                dispatch(setNewChannelModalOpen(true));
                setOpenSideMenu(false);
              }}
            >
              Новый канал
            </Button>

            <Button
              aria-label="Настройки"
              tabIndex={isSideMenuOpen ? '0' : '-1'}
              Icon={<SettingsIcon className="side-menu-option__icon"/>}
              className="centred-button button-with-pre-icon"
            >
              Настройки
            </Button>

            <Button
              aria-label="Темная тема"
              tabIndex={isSideMenuOpen ? '0' : '-1'}
              as="label"
              htmlFor="night-mode-toggle"
              className="centred-button button-with-pre-icon night-mode-toggle-wrapper"
              Icon={<DarkModeIcon className="side-menu-option__icon"/>}
            >
              Темная тема
              <Toggle toggleId="night-mode-toggle" className="night-mode-toggle"/>
            </Button>

          </ul>
        </div>
      </FocusLock>

      {
        (isCreateNewChatModalOpen && <CreateNewChatModal setNewChatModalOpen={setNewChatModalOpen} />) ||
        (isCreateNewChannelModalOpen && <CreateNewChannelModal />)
      }
    </>
  );
};


SideMenu.propTypes = {
  isSideMenuOpen: PropTypes.bool,
  setOpenSideMenu: PropTypes.func
};
