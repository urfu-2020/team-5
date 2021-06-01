import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";

import './chat-header.css';

import {SearchIcon} from "../../UtilComponents/Icons/SearchIcon";
import {getDialogInfo} from "../../../utils/chatUtils";
import {selectCurrentUser} from "../../../store/slices/userSlice/userSelectors";
import {getDeclOfNum} from "../../../utils/stringUtils";
import {Button} from "../../UtilComponents/Button/Button";


/* eslint max-len: "off" */
export const ChatHeader = ({currentChat, isOnline}) => {
  const currentUser = useSelector(selectCurrentUser);
  const {members, chatType, chatTitle} = currentChat;
  const {dialogChatTitle} = getDialogInfo(members, chatType, currentUser.id);

  const openListIntervalId = useRef(null);
  const closeListIntervalId = useRef(null);
  const [isMembersListOpen, setMembersListOpen] = useState(null);

  const groupMembersMouseEnterHandler = () => {
    if (isMembersListOpen && closeListIntervalId.current)
      clearInterval(closeListIntervalId.current);
    else if (!isMembersListOpen) {
      openListIntervalId.current = setTimeout(() => {
        setMembersListOpen(true);
      }, 500);
    }
  };

  const groupMembersMouseLeaveHandler = () => {
    if (openListIntervalId.current) clearInterval(openListIntervalId.current);
    if (isMembersListOpen) {
      closeListIntervalId.current = setTimeout(() => {
        setMembersListOpen(false);
      }, 500);
    }
  };

  return (
    <>
      <header className="chat-header chat-container__chat-header">
        <section className="chat-header__chat-data">
          <h4 className="chat-data__chat-name chat-name">
            {chatType === 'Own' ? 'Saved Messages' : chatType === 'Dialog' ? dialogChatTitle : chatTitle}
          </h4>
          {
            chatType === 'Dialog' ? (
                <p className="chat-data__chat-status chat-status">
                  {isOnline ? 'В сети' : 'Не в сети'}
                  {
                    chatType === 'Group' && `${members.length} ${getDeclOfNum(members.length,
                      ['участник', 'участника', 'участников'])}`
                  }
                </p>
              ) :
              chatType === 'Group' && (
                <>
                  <p
                    className="chat-data__chat-status chat-status"
                    onMouseEnter={groupMembersMouseEnterHandler}
                    onMouseLeave={groupMembersMouseLeaveHandler}
                  >
                    {`${members.length} ${getDeclOfNum(members.length, ['участник', 'участника', 'участников'],)}`}
                  </p>
                  {isMembersListOpen && (
                    <div
                      className="chat-data__members-list members-list"
                      onMouseEnter={groupMembersMouseEnterHandler}
                      onMouseLeave={groupMembersMouseLeaveHandler}
                    >
                      {
                        members.map(member => (

                          <Button
                            key={member.id}
                            className={'members-list__member member button-with-pre-icon'}
                            Icon={<img className="member__avatar" src={member.avatarUrl} alt="user avatar"/>}
                            role="listitem"
                          >
                            <p className={"member__username"}>{member.username}</p>
                          </Button>
                        ))
                      }
                    </div>
                  )}
                </>
              )
          }
        </section>
        <div className="options-container chat-header__options-container">
          <SearchIcon className="options-container__icon icon"/>
          <svg className="options-container__icon icon" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path
              d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
          </svg>
          <svg className="options-container__icon icon" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <svg className="options-container__icon icon" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      </header>
    </>
  );
};

export const MemoizedChatHeader = React.memo(ChatHeader);

ChatHeader.propTypes = {
  currentChat: PropTypes.shape({
    id: PropTypes.number,
    chatType: PropTypes.oneOf(["Own", "Dialog", "Group", "Channel"]),
    chatAvatarUrl: PropTypes.string,
    chatTitle: PropTypes.string,
    members: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      avatarUrl: PropTypes.string,
      githubUrl: PropTypes.string
    }))
  }),
  isOnline: PropTypes.bool
};
