function getNewChat(userChat) {
  const {
    chatId, chatType, sobesednikAvatarUrl, sobesednikUsername
  } = userChat;
  let {chatAvatarUrl, chatTitle} = userChat;
  if (chatType === 'Own' || chatType === 'Dialog') {
    chatAvatarUrl = sobesednikAvatarUrl;
    chatTitle = sobesednikUsername;
  }

  return {
    chatId,
    chatType,
    chatAvatarUrl,
    chatTitle,
    sobesedniki: []
  };
}

export function convertRawNewDialog(userChat) {
  const newChat = getNewChat(userChat);
  newChat.sobesedniki.push(
    {
      id: userChat.sobesednikId,
      username: userChat.sobesednikUsername,
      avatarUrl: userChat.sobesednikAvatarUrl,
      githubUrl: userChat.sobesednikGHUrl
    }
  );
  return newChat;
}

export function convertRawStartChatsData(rawChatsInfo, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach((userChat) => {
    if (!chats[userChat.chatId]) {
      chats[userChat.chatId] = getNewChat(userChat);
    }
    chats[userChat.chatId].sobesedniki.push(
      {
        id: userChat.sobesednikId,
        username: userChat.sobesednikUsername,
        avatarUrl: userChat.sobesednikAvatarUrl,
        githubUrl: userChat.sobesednikGHUrl
      }
    );
  });
  lastMessages.forEach((message) => {
    chats[message.chatId].lastMessage = message;
  });
  return chats;
}
