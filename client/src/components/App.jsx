import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {LoginPage} from "./LoginPage/LoginPage";
import {HomePage} from "./HomePage";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage}/>
        <Route path="/login" exact component={LoginPage} />
      </Switch>
    </Router>
    );
};

export default App;
