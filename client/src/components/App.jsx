import React, {useEffect, useState} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage/HomePage";
import {Spinner} from "./Controls/Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {NotFoundPage} from "./NotFoundPage/NotFoundPage";
import {Chat} from "./Chat/Chat";
import {Navigation} from "./Navigation/Navigation";
import {fetchStartChatsDataThunk} from "../thunks/chatThunks";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.app.currentUser);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      dispatch(fetchStartChatsDataThunk());
      setLoading(false);
    }
  }, []);


  return isLoading ? <Spinner className="spinner_main"/> :
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
