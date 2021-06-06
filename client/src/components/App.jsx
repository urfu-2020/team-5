import React, {useEffect} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage/HomePage";
import {Spinner} from "./UtilComponents/Spinner/Spinner";
import {Chat} from "./Chat/Chat";
import {Navigation} from "./Navigation/Navigation";
import {setCurrentUser} from "../store/slices/userSlice/userThunks";
import {selectIsUserLoading, selectUserId} from "../store/slices/userSlice/userSelectors";
import {selectAppError, selectIsDarkTheme, selectIsThemeLoading} from "../store/slices/appSlice/appSelectors";
import {ErrorCard} from "./UtilComponents/ErrorCard/ErrorCard";
import {setError} from "../store/slices/appSlice/appSlice";
import {initSocket} from "../store/middlewares/socketReduxActions";
import {selectIsChatsDataLoading} from "../store/slices/chatsSlice/chatsSelectors";


const App = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);
  const isUserLoading = useSelector(selectIsUserLoading);
  const appError = useSelector(selectAppError);
  const isDarkTheme = useSelector(selectIsDarkTheme);
  const isThemeLoading = useSelector(selectIsThemeLoading);
  const isChatsDataLoading = useSelector(selectIsChatsDataLoading);

  useEffect(() => {
    if (!currentUserId)
      dispatch(setCurrentUser());
    else
      dispatch(initSocket());
  }, [currentUserId]);

  return isThemeLoading || isUserLoading || isChatsDataLoading ? <Spinner className="spinner_main"/> :
    currentUserId ? (
      <div id="app" className={`${isDarkTheme ? 'app_dark' : 'app_light'}`}>
        <Navigation />
        <Switch>
          <Route path="/" exact component={HomePage}/>
          <Route path={`/chat/:chatId`} exact component={Chat}/>
          {/*<Route path="*" component={NotFoundPage}/>*/}
        </Switch>
        {
          appError && <ErrorCard
            className="app__error-card"
            errorMessage={appError}
            onClose={() => dispatch(setError({errorMessage: null}))}
          />
        }
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
