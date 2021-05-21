import {useSelector} from "react-redux";
import React from 'react';
import PropTypes from 'prop-types';

import './side-menu.css';

import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {SideMenuOption} from "./SideMenuOption/SideMenuOption";
import {NewGroupIcon} from "./SideMenuOption/SideMenuOptionIcons/NewGroupIcon";
import {SettingsIcon} from "./SideMenuOption/SideMenuOptionIcons/SettingsIcon";
import {DarkModeIcon} from "./SideMenuOption/SideMenuOptionIcons/DarkModeIcon";
import {Toggle} from "../../Controls/Toggle/Toggle";

export const SideMenu = ({isSideMenuOpen, setOpenSideMenu}) => {
  const user = useSelector(selectCurrentUser);

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
            onKeyDown={keyDownHandler}
          />
        )
      }

      <div className={`side-menu ${isSideMenuOpen ? 'side-menu_open' : 'side-menu_close'}`}>
        <div className="side-menu__header">
          <img className="side-menu__user-avatar" src={user.avatarUrl} alt="аватар пользователя"/>
          <p className="side-menu__user-name">{user.username}</p>
        </div>
        <div className="side-menu__main">
          <SideMenuOption Icon={NewGroupIcon} text="Новая группа"/>
          <SideMenuOption Icon={SettingsIcon} text="Настройки"/>

          <SideMenuOption htmlFor="night-mode-toggle" className="night-mode-toggle-wrapper" as="label"
                          Icon={DarkModeIcon} text="Ночной режим">
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
