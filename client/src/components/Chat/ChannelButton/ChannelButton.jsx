import React from "react";
import PropTypes from 'prop-types';
import {Button} from "../../UtilComponents/Button/Button";
import {useDispatch, useSelector} from "react-redux";
import {selectIsSubscribing, selectUserChats} from "../../../store/slices/chatsSlice/chatsSelectors";
import {subscribeToChannel, unsubscribeFromChannel} from "../../../store/middlewares/socketReduxActions";
import {Spinner} from "../../UtilComponents/Spinner/Spinner";

export const ChannelButton = ({channelId}) => {
  const dispatch = useDispatch();

  const isSubscribing = useSelector(selectIsSubscribing);
  const chatIds = Object.values(useSelector(selectUserChats)).map(chat => chat.id);
  const isSubscribed = chatIds.includes(channelId);

  const clickHandler = e => {
    e.preventDefault();
    if (isSubscribed) {
      dispatch(unsubscribeFromChannel(channelId));
    }
    else {
      dispatch(subscribeToChannel(channelId));
    }
  };

  return (
    <Button
      className="text-button channel-button"
      onClick={clickHandler}
      disabled={isSubscribing}
    >
      {
        isSubscribing ? <Spinner className="channel-button__spinner" /> :
        isSubscribed ? 'Отписаться' : 'Подписаться'
      }
    </Button>
  );
};

ChannelButton.propTypes = {
  channelId: PropTypes.number
};
