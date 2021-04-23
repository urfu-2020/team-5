import React from 'react';
import PropTypes from 'prop-types';
import { config } from '../../../config';

const { staticBasePath } = config;

/* eslint max-len: "off" */
export const ChatMessage = ({ message, time, isMyMessage }) => (
  <div className={`chat-area__message ${isMyMessage ? 'chat-area__message_my' : 'chat-area__message_income'}`}>
    <div className={`cloud message__cloud ${isMyMessage ? 'message__cloud_my cloud_my' : 'message__cloud_income cloud_income'}`}>
      <span className="message-text cloud__message-text">
        {message}
      </span>
      <span className="message-time cloud__message-time">
        {time}
      </span>
      <svg
        className="ticks cloud__ticks"
        height="20px"
        viewBox="0 0 24 24"
        width="20px"
        fill="#000000"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"
        />
      </svg>
    </div>
    <svg
      className="message__chat-avatar"
      style={{ height: '40px', width: '40px' }}
    >
      <defs>
        <mask id="circle">
          <circle cx="20" cy="20" fill="white" r="20" />
        </mask>
      </defs>
      <g mask="url(#circle)">
        <image
          x="0"
          y="0"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          xlinkHref={`${staticBasePath}images/unnamed.jpg`}
          style={{ height: '40px', width: '40px' }}
        />
        <circle className="chat-avatar-border" cx="20" cy="20" r="20" />
      </g>
    </svg>
  </div>
);

ChatMessage.propTypes = {
  message: PropTypes.string,
  time: PropTypes.string.isRequired,
  isMyMessage: PropTypes.bool.isRequired
};

ChatMessage.defaultProps = {
  message: ''
};