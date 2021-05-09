export function convertRawStartChatsData(rawChatsInfo, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach((userChat) => {
    if (!chats[userChat.chatId]) {
      const {
        chatId, chatType, sobesednikAvatarUrl, sobesednikUsername
      } = userChat;
      let { chatAvatarUrl, chatTitle } = userChat;
      if (chatType === 'Own' || chatType === 'Dialog') {
        chatAvatarUrl = sobesednikAvatarUrl;
        chatTitle = sobesednikUsername;
      }
      chats[userChat.chatId] = {
        chatId,
        chatType,
        chatAvatarUrl,
        chatTitle,
        sobesedniki: [],
        messages: []
      };
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
    chats[message.chatId].messages.push(message);
  });
  return chats;
}
