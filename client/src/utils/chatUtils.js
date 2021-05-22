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
