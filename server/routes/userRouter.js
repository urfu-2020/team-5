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

function groupMessagesByChats(messages) {
  const res = {};
  messages.forEach((message) => {
    const key = message.ChatId;
    const collection = res[key];
    if (!collection) {
      res[key] = [message];
    } else {
      collection.push(message);
    }
  });
  return res;
}

router.get('/:userId/chatsData', async (req, res) => {
  const { userId } = req.params;
  const chatsInfo = await getUserChats(userId);
  const chatsMessages = groupMessagesByChats(await getUserChatsMessages(userId));

  res.json({
    chatsInfo,
    chatsMessages
  });
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
