import {useSelector} from "react-redux";
import React, {useState} from 'react';
import PropTypes from 'prop-types';

import './side-menu.css';

import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {SideMenuOption} from "./SideMenuOption/SideMenuOption";
import {NewGroupIcon} from "../../Controls/Icons/NewGroupIcon";
import {SettingsIcon} from "../../Controls/Icons/SettingsIcon";
import {DarkModeIcon} from "../../Controls/Icons/DarkModeIcon";
import {Toggle} from "../../Controls/Toggle/Toggle";


export const SideMenu = ({isSideMenuOpen, setOpenSideMenu}) => {
  const user = useSelector(selectCurrentUser);

  // const [isNewChatModalOpen, setNewChatModalOpen] = useState(false);

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
          <SideMenuOption
            Icon={<NewGroupIcon className="side-menu-option__icon"/>}
            text="Новая группа"
            onClick={() => {
              // setNewChatModalOpen(true);
              setOpenSideMenu(false);
            }}
          />

          <SideMenuOption Icon={<SettingsIcon className="side-menu-option__icon"/>} text="Настройки"/>

          <SideMenuOption htmlFor="night-mode-toggle" className="night-mode-toggle-wrapper" as="label"
                          Icon={<DarkModeIcon className="side-menu-option__icon"/>} text="Ночной режим">
            <Toggle toggleId="night-mode-toggle" className="night-mode-toggle"/>
          </SideMenuOption>

        </div>
      </div>
    </>
  );
};

SideMenu.propTypes = {
  isSideMenuOpen: PropTypes.bool,
  setOpenSideMenu: PropTypes.func
};
