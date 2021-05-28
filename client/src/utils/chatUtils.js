import {config} from "../config";
import {SavedMessagesIcon} from "../components/UtilComponents/Icons/SavedMessagesIcon";
import {NewChatIcon} from "../components/UtilComponents/Icons/NewChatIcon";
import {ChatAvatar} from "../components/Navigation/ChatCard/ChatAvatar/ChatAvatar";
import {NewChannelIcon} from "../components/UtilComponents/Icons/NewChannelIcon";
import React from "react";
import {getDeclOfNum} from "./stringUtils";


export const loadOldMessages = async ({chatId, offset, cbOnAllLoaded, controller}) => {
  const {LOAD_MESSAGES_THRESHOLD} = config;
  try {
    const {oldMessages} = await (await fetch(`/api/chat/${chatId}/${offset}/${LOAD_MESSAGES_THRESHOLD}`, {
      signal: controller.signal
    })).json();

    if (oldMessages.length < LOAD_MESSAGES_THRESHOLD) {
      cbOnAllLoaded();
    }
    return {oldMessages};
  } catch (e) {
    console.error(e);
  }
};

export const getSobesednikAvatarUrl = (members, senderId) => {
  return members.find(user => user.id === senderId).avatarUrl;
};

export const isMyMessage = (myId, senderId) => {
  return myId === senderId;
};

export const getDialogInfo = (members, chatType, currentUserId) => {
  let chatAvatarUrl, chatTitle;
  if (chatType === 'Dialog') {
    const sobesednik = members.find(member => member.id !== currentUserId);
    chatAvatarUrl = sobesednik.avatarUrl;
    chatTitle = sobesednik.username;
  }
  if (chatType === 'Own') {
    chatAvatarUrl = members[0].avatarUrl;
    chatTitle = members[0].username;
  }

  return {
    dialogAvatarUrl: chatAvatarUrl,
    dialogChatTitle: chatTitle
  };
};


/**
 * Получить инфу для рендера чата или канала в меню слева (пока авы у всех кроме диалога это иконки)
 * @param chatType {String}
 * @param title: {String}
 * @param avatarUrl {String} Только для диалога
 * @param isOnline {String} Только для диалога
 */
export const getRenderChatInfo = (chatType, {title, avatarUrl, isOnline}) => {
  switch (chatType) {
    case 'Own': {
      return {
        avatar: <SavedMessagesIcon className="chat-card-avatar-icon"/>,
        ariaLabel: 'Сохраненные сообщения'
      };
    }
    case 'Group': {
      return {
        avatar: <NewChatIcon className="chat-card-avatar-icon"/>,
        ariaLabel: `Группа ${title}`
      };
    }
    case 'Dialog': {
      return {
        avatar: <ChatAvatar avatarUrl={avatarUrl} isOnline={isOnline}/>,
        ariaLabel: `Диалог c пользователем ${title}`
      };
    }
    case 'Channel': {
      return {
        avatar: <NewChannelIcon className="chat-card-avatar-icon"/>,
        ariaLabel: `Канал ${title}`
      };
    }
  }
};


export function getChatStartMessage(chatType, myId, owner, members) {
  switch (chatType) {
    case 'Own': {
      return 'Начало сохраненных сообщений.';
    }
    case 'Group': {
      const membersLength = members.length;
      return `Пользователь ${owner.username} создает чат с ${membersLength} ${getDeclOfNum(membersLength,
        ['участником', 'участниками', 'участниками'])}.`;
    }
    case 'Dialog': {
      const sobesednik = members.find(member => member.id !== myId.id);
      return `Начало диалога с пользователем ${sobesednik.username}.`;
    }
    case 'Channel': {
      return `Пользователь ${owner.username} создает канал.`;
    }
  }
}
