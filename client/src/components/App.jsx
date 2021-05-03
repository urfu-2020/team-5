import React, {useEffect, useState} from 'react';

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage";
import {Spinner} from "./Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setChatsInfo, setChatsMessages, setCurrentUser, setLoading} from "../store/slices/appSlice";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.app.currentUser);
  const isLoading = useSelector(state => state.app.isLoading);
  const chatsId = (useSelector(state => state.app.chatsInfo)).map(chatInfo => chatInfo.ChatId);

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

  return isLoading ? <Spinner className="main-spinner" /> : currentUser ? <HomePage /> : <LoginPage />;

  // Потом разберусь с роутером и сделаю нормально
  // return (
  //   <Router>
  //       { userId ? (
  //         <Switch>
  //           <Route path="/" exact component={HomePage}/>
  //         </Switch>
  //       ) : (
  //         <Switch>
  //           <Route path="/login" exact component={LoginPage} />
  //         </Switch>
  //       )}
  //   </Router>
  //   );
};

export default App;
