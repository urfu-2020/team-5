import React, {useEffect} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage/HomePage";
import {Spinner} from "./Controls/Spinner/Spinner";
import {NotFoundPage} from "./NotFoundPage/NotFoundPage";
import {Chat} from "./Chat/Chat";
import {Navigation} from "./Navigation/Navigation";
import {setCurrentUser} from "../store/slices/userSlice/userThunks";
import {selectIsUserLoading, selectUserId} from "../store/slices/userSlice/userSelectors";
import {initSocket} from "../store/middlewares/socketMiddleware";


const App = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);
  const isUserLoading = useSelector(selectIsUserLoading);

  useEffect(() => {
    if (!currentUserId)
      dispatch(setCurrentUser());
    else
      dispatch(initSocket());
  }, [currentUserId]);


  return isUserLoading ? <Spinner className="spinner_main"/> :
    currentUserId ? (
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
