import React, {useEffect} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage/HomePage";
import {Spinner} from "./Controls/Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {NotFoundPage} from "./NotFoundPage/NotFoundPage";
import {Chat} from "./Chat/Chat";
import {Navigation} from "./Navigation/Navigation";
import {loadingStateEnum, setChatsData, setCurrentUser} from "../store/slices/appSlice";


const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.app.currentUser);
  const loadingState = useSelector(state => state.app.loadingState);

  useEffect(() => {
    if (!currentUser) {
      dispatch(setCurrentUser());
    } else {
      dispatch(setChatsData(currentUser.id));
    }
  }, [currentUser]);


  return loadingState === loadingStateEnum.APP_LOADING ? <Spinner className="spinner_main"/> :
    currentUser ? (
      <div id="app">
        <nav className="navigation">
          <Navigation/>
        </nav>
        <Switch>
          <Route path="/" exact component={HomePage}/>
          <Route path={`/chat/:chatId`} exact component={Chat}/>
          <Route path="*" component={NotFoundPage}/>
        </Switch>
      </div>
    ) : (
      <>
        <Redirect to={"/login"}/>
        <Switch>
          <Route path="/login" exact component={LoginPage}/>
        </Switch>
      </>
    );
};

export default App;
