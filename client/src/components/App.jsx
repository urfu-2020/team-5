import React, {useEffect} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage/HomePage";
import {Spinner} from "./Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setChatsInfo, setChatsMessages, setCurrentUser, setLoading} from "../store/slices/appSlice";
import {NotFoundPage} from "./NotFoundPage/NotFoundPage";
import {Chat} from "./CurrentChat/Chat";
import {Navigation} from "./Navigation/Navigation";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.app.currentUser);
  const isLoading = useSelector(state => state.app.isLoading);

  const fetchAppData = () => async dispatch => {
    dispatch(setLoading(true));
    const {user} = await (await fetch('/user/self')).json();
    if (user) {
      dispatch(setCurrentUser(user));
      const {chatsInfo, chatsMessages} = await (await fetch(`/user/${user.Id}/chatsData`)).json();
      dispatch(setChatsInfo(chatsInfo));
      dispatch(setChatsMessages(chatsMessages));
    }
    dispatch(setLoading(false));
  };

  useEffect(  () => {
    if(!currentUser) {
      dispatch(fetchAppData());
    }
  }, []);


  return  isLoading ? <Spinner className="main-spinner" /> :
          currentUser ? (
            <div id="app">
              <nav className="navigation">
                <Navigation />
              </nav>
              <Switch>
                <Route path="/" exact component={HomePage} />
                {/* Несуществующие айдишники чатов отображает как пустой чат, потом починить */}
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
