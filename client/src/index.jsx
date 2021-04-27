import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './css/layout.css';

import App from './components/App';
import Greeting from './components/Greeting/Greeting';
import {store} from './store/store';

class Auth extends Component {
  state = {
    user: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ user: res.user }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch(`/user`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    if (this.state.user) {
      return <App />;
    }
    return <Greeting />;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
