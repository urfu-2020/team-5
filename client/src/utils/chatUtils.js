import {config} from "../config";

export const getSobesednikAvatarUrl = (members, senderId) => {
  return members.find(user => user.id === senderId).avatarUrl;
};

export const isMyMessage = (myId, senderId) => {
  return myId === senderId;
};

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
