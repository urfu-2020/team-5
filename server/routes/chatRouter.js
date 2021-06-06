const express = require('express');
const {
  getChannelsAndMessagesByQuery, getMessagesUntilFoundMessage,
  getChatInfo, getUserChatsIds, getChatMessages
} = require('../db/dbapi');

const router = express.Router();

/**
 * Получить ${count} сообщений со смещением ${offset} из чата с id === ${chatId}
 */
router.get('/oldMessages/:chatId/:offset/:count', async (req, res) => {
  const chatId = +req.params.chatId;
  const offset = +req.params.offset;
  const count = +req.params.count;
  const chat = await getChatInfo(chatId);
  // Если это не канал, то пользователь должен состоять в чате
  const userChatsIds = await getUserChatsIds(req.user.id);
  if (chat.chatType === 'Channel' || userChatsIds.find((userChatId) => userChatId === chatId)) {
    const oldMessages = (await getChatMessages(chatId, offset, count)).reverse();
    res.json({
      oldMessages
    });
  } else {
    res.status(403).json({ error: true, errorMessage: 'Вы не можете получить эти данные' });
  }
});

/**
 * Получить все сообщения до искомого
 */
router.get('/oldUntilFoundMessage/:chatId/:messageId', async (req, res) => {
  try {
    const chatId = +req.params.chatId;
    const messageId = +req.params.messageId;

    const chat = await getChatInfo(chatId);
    const userChatsIds = await getUserChatsIds(req.user.id);
    if (chat.chatType === 'Channel' || userChatsIds.find((userChatId) => userChatId === chatId)) {
      const oldMessages = (await getMessagesUntilFoundMessage(chatId, messageId)).reverse();
      res.json({
        oldMessages
      });
    } else {
      res.status(403).json({ error: true, errorMessage: 'Вы не можете получить эти данные' });
    }
  } catch (e) {
    console.log(e);
  }
});

/**
 * Получить результат поиска каналов и сообщений
 */
router.get('/search/:query', async (req, res) => {
  res.json(await getChannelsAndMessagesByQuery(req.user.id, req.params.query));
});

module.exports = router;
