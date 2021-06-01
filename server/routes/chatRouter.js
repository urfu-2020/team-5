const express = require('express');
const {
  getAllChannelsByQuery,
  getChatInfo, getUserChatsIds, getChatMessages
} = require('../db/dbapi');

const router = express.Router();

/**
 * Получить ${count} сообщений со смещением ${offset} из чата с id === ${chatId}
 */
router.get('/:chatId/:offset/:count', async (req, res) => {
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

router.get('/channels/:query', async (req, res) => {
  const channels = await getAllChannelsByQuery(req.params.query);
  res.json({ channels });
});

module.exports = router;
