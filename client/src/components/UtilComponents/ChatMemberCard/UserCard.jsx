import React from "react";
import PropTypes from 'prop-types';
import {Button} from "../Button/Button";

export const UserCard = ({ cardClassName, iconClassName, usernameClassName, user, onCardClick, ...otherProps }) => {
  return (
    <Button
      onClick={onCardClick}
      className={
        `button-with-pre-icon ${cardClassName ? cardClassName : ''}`
      }
      key={user.id}
      Icon={<img className={iconClassName ? iconClassName : ''} src={user.avatarUrl} alt="user avatar" />}
      {...otherProps}
    >
      <p className={usernameClassName ? usernameClassName : ''}>{user.username}</p>
    </Button>
  );
};


UserCard.propTypes = {
  cardClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  usernameClassName: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    avatarUrl: PropTypes.string,
    githubUrl: PropTypes.string
  }),
  onCardClick: PropTypes.func
};
