const express = require('express');
const { getUserChatsIds, getChatMessages } = require('../db/dbapi');

const router = express.Router();

/**
 * Получить ${count} сообщений со смещением ${offset} из чата с id === ${chatId}
 */
router.get('/:chatId/:offset/:count', async (req, res) => {
  const chatId = +req.params.chatId;
  const offset = +req.params.offset;
  const count = +req.params.count;
  const userChatsIds = await getUserChatsIds(req.user.id);
  if (userChatsIds.find((userChatId) => userChatId === chatId)) {
    const oldMessages = (await getChatMessages(chatId, offset, count)).reverse();
    res.json({
      oldMessages
    });
  } else {
    res.status(403).json({ error: 'Вы не можете получить эти данные' });
  }
});

module.exports = router;
