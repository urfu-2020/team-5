import React from 'react';
import PropTypes from 'prop-types';

import {Button} from "../../Controls/Button/Button";


export const NavigationHeader = ({setOpenSideMenu}) => (
  <header className="navigationHeaderWrapper">
    <Button
      className="button"
      aria-label="Открыть главное меню"
      type="button"
      onClick={() => setOpenSideMenu(true)}
    >
      <svg className="mainMenuButton__icon" height="2.5em" viewBox="0 0 24 24" width="2.5em">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
    </Button>
    <form action="" className="search">
      <input type="text" placeholder="Поиск" aria-label="Поиск" />
    </form>
  </header>
);


NavigationHeader.propTypes = {
  setOpenSideMenu: PropTypes.func
};
