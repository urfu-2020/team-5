import React, {useEffect, useState} from 'react';

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage";
import {Spinner} from "./Spinner/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {setContacts, setCurrentUser, setLoading} from "../store/slices/appSlice";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.app.currentUser);
  const isLoading = useSelector(state => state.app.isLoading);

  const fetchAppData = () => async dispatch => {
    dispatch(setLoading(true));
    const {user} = await (await fetch('/user/own')).json();
    if (user) {
      dispatch(setCurrentUser(user));
      const {contacts} = await (await fetch('/user/contacts')).json();
      dispatch(setContacts(contacts));
    }
    dispatch(setLoading(false));
  };

  useEffect( () => {
    if(!currentUser)
      dispatch(fetchAppData());
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
