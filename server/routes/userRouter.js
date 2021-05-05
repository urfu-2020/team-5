const express = require('express');

const dbapi = require('../db/dbapi');
const { getUserChats } = require('../db/dbapi');

const router = express.Router();

router.get('/contacts', async (req, res) => {
  res.json({
    contacts: await dbapi.getUsers()
  });
});

router.get('/:userId/chatsData', async (req, res) => {
  const { userId } = req.params;
  const rawChatsInfo = await getUserChats(userId);
  const chats = {};
  rawChatsInfo.forEach((chat) => chats[chat.chatId] = { ...chat, messages: [], offset: 0 });
  res.json({ chats });
});

router.get('/self', async (req, res) => {
  let user = null;
  if (req.user) {
    user = await dbapi.getUserByName(req.user.username);
  }

  res.json({
    user
  });
});

module.exports = router;
