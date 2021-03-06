import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import './navigation-header.css';

import {Button} from "../../UtilComponents/Button/Button";
import {useDebounce} from "../../../hooks/useDebounce";
import {useDispatch, useSelector} from "react-redux";
import {setSearchResult} from "../../../store/slices/appSlice/appThunks";
import {
  setFoundMessage,
  setIsSearching,
  setIsSideMenuOpen,
  setSelectedTab, tabTypes
} from "../../../store/slices/appSlice/appSlice";
import {selectIsDarkTheme, selectSelectedTab} from "../../../store/slices/appSlice/appSelectors";


export const NavigationHeader = ({isSearching, searchInputRef}) => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const selectedTab = useSelector(selectSelectedTab);

  useEffect(
    () => {
      if (debouncedSearch) {
        dispatch(setSearchResult(debouncedSearch));
      } else {
        dispatch(setIsSearching(false));
        dispatch(setFoundMessage(null));
      }
    },
    [debouncedSearch]
  );

  return (
    <header className={`navigation-header ${isDarkTheme ? 'navigation-header_dark' : ''}`}>
      <div className="navigation-header__first-line">
        <Button
          className="rounded-button centred-button"
          aria-label="Открыть главное меню"
          type="button"
          onClick={() => dispatch(setIsSideMenuOpen(true))}
        >
          <svg className="mainMenuButton__icon" height="2.5em" viewBox="0 0 24 24" width="2.5em">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </Button>
        <form action="" className="search" onSubmit={e => e.preventDefault()}>
          <input
            ref={searchInputRef}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            type="text"
            placeholder="Поиск"
            aria-label="Поиск"
            title="Начните вводить название канала или текст из искомого сообщения."
          />
        </form>
      </div>
      {
        !isSearching && (
          <div className="navigation-header__tabs header-tabs" role="tablist">
            <Button
              role="tab"
              tabIndex="0"
              aria-selected={selectedTab === tabTypes.Chats}
              className={`header-tabs__tab ${selectedTab === tabTypes.Chats ? 'chats-tab_selected' : ''}`}
              onClick={() => dispatch(setSelectedTab(tabTypes.Chats))}
            >
              Чаты
            </Button>
            <Button
              role="tab"
              tabIndex="0"
              aria-selected={selectedTab === tabTypes.Channels}
              className={`header-tabs__tab ${selectedTab === tabTypes.Channels ? 'chats-tab_selected' : ''}`}
              onClick={() => dispatch(setSelectedTab(tabTypes.Channels))}
            >
              Каналы
            </Button>
          </div>
        )
      }
    </header>
  );
};


NavigationHeader.propTypes = {
  searchInputRef: PropTypes.object,
  isSearching: PropTypes.bool,
  setIsSearching: PropTypes.bool,
  setSearchResult: PropTypes.func
};
