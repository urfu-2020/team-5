import React from "react";
import PropTypes from 'prop-types';

export const ChatAvatar = ({avatarUrl, isOnline}) => {
  return (
    <div className="card__avatar">
      <svg role="none" style={{height: '64px', width: '64px'}}>
        <defs>
          <mask id="circle_online">
            <circle cx="32" cy="32" fill="white" r="32"/>
            <circle cx="56" cy="56" fill="black" r="7"/>
          </mask>
          <mask id="circle_offline">
            <circle cx="32" cy="32" fill="white" r="32"/>
          </mask>
        </defs>
        <g mask={`${isOnline ? 'url(#circle_online)' : 'url(#circle_offline)'}`}>
          <image x="0" y="0" height="100%" preserveAspectRatio="xMidYMid slice" width="100%"
                 xlinkHref={avatarUrl} style={{height: '64px', width: '64px'}} />
          <circle className="avatar__border" cx="32" cy="32" r="32"/>
        </g>
      </svg>
      {
        isOnline ? (<div className="badge"/>) : null
      }
    </div>
  );
};


ChatAvatar.propTypes = {
  avatarUrl: PropTypes.string.isRequired,
  isOnline: PropTypes.bool.isRequired
};
