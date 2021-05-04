const express = require('express');

const dbapi = require('../db/dbapi');
const { getUserChatsMessages } = require('../db/dbapi');
const { getUserChats } = require('../db/dbapi');

const router = express.Router();

router.get('/contacts', async (req, res) => {
  res.json({
    contacts: await dbapi.getUsers()
  });
});

function groupMessagesByChats(chats, messages) {
  messages.forEach((message) => {
    const key = message.chatId;
    const collection = chats[key].messages;
    if (!collection) {
      chats[key].messages = [message];
    } else {
      collection.push(message);
    }
  });
  return chats;
}

router.get('/:userId/chatsData', async (req, res) => {
  const { userId } = req.params;
  const rawChatsInfo = await getUserChats(userId);
  const chatsInfo = {};
  rawChatsInfo.forEach((chat) => chatsInfo[chat.chatId] = { ...chat, messages: [] });
  const chats = groupMessagesByChats(chatsInfo, await getUserChatsMessages(userId));

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
