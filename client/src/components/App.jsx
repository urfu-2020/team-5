import React, {useEffect, useState} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage/HomePage";
import {Spinner} from "./Controls/Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setChatsData, setCurrentUser} from "../store/slices/appSlice";
import {NotFoundPage} from "./NotFoundPage/NotFoundPage";
import {Chat} from "./Chat/Chat";
import {Navigation} from "./Navigation/Navigation";

function convertRawData(rawChatsInfo, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach((userChat) => {
    if (!chats[userChat.chatId]) {
      const {
        chatId, chatType, sobesednikAvatarUrl, sobesednikUsername
      } = userChat;
      let { chatAvatarUrl, chatTitle } = userChat;
      if (chatType === 'Own' || chatType === 'Dialog') {
        chatAvatarUrl = sobesednikAvatarUrl;
        chatTitle = sobesednikUsername;
      }
      chats[userChat.chatId] = {
        chatId,
        chatType,
        chatAvatarUrl,
        chatTitle,
        sobesedniki: [],
        messages: []
      };
    }
    chats[userChat.chatId].sobesedniki.push(
      {
        id: userChat.sobesednikId,
        username: userChat.sobesednikUsername,
        avatarUrl: userChat.sobesednikAvatarUrl,
        githubUrl: userChat.sobesednikGHUrl
      }
    );
  });

  lastMessages.forEach((message) => {
    chats[message.chatId].messages.push(message);
  });
  return chats;
}

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.app.currentUser);
  const [isLoading, setLoading] = useState(true);

  const fetchChatsData = async () =>  {
    setLoading(true);
    const {user} = await (await fetch('/user/self')).json();
    if (user) {
      dispatch(setCurrentUser(user));
      const {rawChatsInfo, lastMessages} = await (await fetch(`/user/${user.id}/chatsData`)).json();
      const chats = convertRawData(rawChatsInfo, lastMessages);
      dispatch(setChatsData(chats));
    }
    setLoading(false);
  };

  useEffect(  () => {
    if(!currentUser) {
      fetchChatsData();
    }
  }, []);


  return  isLoading ? <Spinner className="spinner_main" /> :
          currentUser ? (
            <div id="app">
              <nav className="navigation">
                <Navigation />
              </nav>
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path={`/chat/:chatId`} exact component={Chat} />
                <Route path="*" component={NotFoundPage} />
              </Switch>
            </div>
          ) : (
            <>
              <Redirect to={"/login"} />
              <Switch>
                <Route path="/login" exact component={LoginPage} />
              </Switch>
            </>
          );
};

export default App;
