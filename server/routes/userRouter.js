const express = require('express');

const {
  getUserByName, getUserChats, getUserLastChatMessages, getUsers
} = require('../db/dbapi');

const router = express.Router();

router.get('/contacts', async (req, res) => {
  res.json({
    contacts: await getUsers()
  });
});

/**
 * Парсим данные для клиента
 * @param rawChatsInfo {Array<ChatModel>} // чатмодель без lastMessage
 * @param lastMessages {Array<MessageModel>}
 * @returns {{ number: ChatModel }}
 */
function convertRawDataForFront(rawChatsInfo, lastMessages) {
  const chats = {};
  rawChatsInfo.forEach((chat) => chats[chat.chatId] = chat);
  lastMessages.forEach((message) => {
    chats[message.chatId].lastMessage = message;
  });
  return chats;
}

router.get('/:userId/chatsData', async (req, res) => {
  const { userId } = req.params;
  const rawChatsInfo = await getUserChats(userId);
  const lastMessages = await getUserLastChatMessages(userId);
  const chats = convertRawDataForFront(rawChatsInfo, lastMessages);
  res.json({ chats });
});

router.get('/self', async (req, res) => {
  let user = null;
  if (req.user) {
    user = await getUserByName(req.user.username);
  }

  res.json({
    user
  });
});

module.exports = router;
