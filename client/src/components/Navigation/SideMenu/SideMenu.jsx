import {useDispatch, useSelector} from "react-redux";
import React, {useState} from 'react';
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
  selectIsCreateNewChannelModalOpen, selectIsDarkTheme, selectIsSideMenuOpen, selectIsSwitching
} from "../../../store/slices/appSlice/appSelectors";
import {Overlay} from "../../UtilComponents/Overlay/Overlay";
import {setIsSideMenuOpen, setNewChannelModalOpen} from "../../../store/slices/appSlice/appSlice";
import {throttle} from "../../../utils/throttle";
import {setTheme} from "../../../store/slices/appSlice/appThunks";

export const SideMenu = () => {
  const user = useSelector(selectCurrentUser);
  const isCreateNewChannelModalOpen = useSelector(selectIsCreateNewChannelModalOpen);
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const isSwitching = useSelector(selectIsSwitching);
  const isSideMenuOpen = useSelector(selectIsSideMenuOpen);

  const dispatch = useDispatch();

  const [isCreateNewChatModalOpen, setNewChatModalOpen] = useState(false);

  const keyDownHandler = e => {
    if (e.key === 'Escape') {
      dispatch(setIsSideMenuOpen(false));
    }
  };

  const switchTheme = e => {
    dispatch(setTheme(!isDarkTheme));
  };

  return (
    <>
      {
        isSideMenuOpen && <Overlay onClick={() => dispatch(setIsSideMenuOpen(false))} />
      }

      <FocusLock disabled={!isSideMenuOpen}>
        <div
          role="menu"
          tabIndex={isSideMenuOpen ? '0' : '-1'}
          aria-hidden={!isSideMenuOpen}
          onKeyDown={keyDownHandler}
          className=
            {`side-menu
            ${isSideMenuOpen ? 'side-menu_open' : 'side-menu_close'}
            ${isDarkTheme ? 'side-menu_dark' : ''}`}
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
                dispatch(setIsSideMenuOpen(false));
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
                dispatch(setIsSideMenuOpen(false));
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
              <Toggle
                toggleId="night-mode-toggle"
                className="night-mode-toggle"
                checked={isDarkTheme}
                onChange={throttle(switchTheme, 300)}
                disabled={isSwitching}
              />
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
