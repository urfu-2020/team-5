import React from 'react';

import {config} from '../../config/config';
import './greeting.css'

const Greeting = () => (
  <>
    <div className="greeting-container">
      <p>Welcome! Please <a href={`http://localhost:${ config.serverPort }/api/login`}>log in with GitHub</a>.</p>
    </div>
  </>
);
export default Greeting;