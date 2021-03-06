import React from "react";
import {useDispatch} from "react-redux";

import './home-page.css';

import {setIsSideMenuOpen, setSelectedTab, tabTypes} from "../../store/slices/appSlice/appSlice";

const BurgerMenuLinkButton = () => {
  const dispatch = useDispatch();

  return (
    <button
      className={`home-page-content__link link`}
      onClick={() => dispatch(setIsSideMenuOpen(true))}
    >
      бургер-меню
    </button>
  );
};

export const HomePage = () => {
  const dispatch = useDispatch();

  return (
    <div className="home-page-content">
      <h1 className="home-page-content__title">
        Привет! Это мессенджер для
        <a
          href="https://github.com/urfu-2020" target="_blank" rel="noreferrer"
          className={`home-page-content__link link link_to-course`}
        > курса </a>
        по фронтенду в УрФУ.
      </h1>
      <p>Реализованные фичи:</p>
      <ul className="home-page-content__features-list features-list">
        <li className="features-list__feature feature">
          <span className="feature__sum">Групповые чаты:</span> можно создать чат для &ge;2 участников. <br />
          Для этого нужно выбрать пункт &quot;Новая группа&quot; в <BurgerMenuLinkButton />.<br />
          Так же в групповом чате можно посмотреть участников, если навести мышку на количество участников.
        </li>
        <li className="features-list__feature feature">
          <span className="feature__sum">Каналы:</span> создать канал можно все в том же <BurgerMenuLinkButton />,
          пункт &quot;Новый канал&quot;.
          Чтобы подписаться на существующий канал нужно ввести его название в поиск, открыть его
          и нажать &quot;Подписаться&quot;. P.S: уже существует &quot;Тестовый канал&quot;. Отслеживаемые каналы
          отображаются в табе <button
            className={`home-page-content__link link`}
            onClick={() => dispatch(setSelectedTab(tabTypes.Channels))}
          >
            &quot;Каналы&quot;
          </button>.
        </li>
        <li className="features-list__feature feature">
          <span className="feature__sum">Серверный поиск сообщений и каналов: </span>
          вводим в поиск текст искомого сообщения. При нажатии на чат с найденным
          сообщением это сообщение подсветится.
        </li>
        <li className="features-list__feature feature">
          <span className="feature__sum">Темная тема: </span> в <BurgerMenuLinkButton /> нужно переключить тогл
          &quot;Темная тема&quot;. Тема запоминается и не слетает при последующих входах в приложение.
        </li>
      </ul>
    </div>
  );
};



