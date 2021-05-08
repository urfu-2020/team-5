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

router.get('/:userId/chatsData', async (req, res) => {
  const { userId } = req.params;
  const rawChatsInfo = await getUserChats(userId);
  const lastMessages = await getUserLastChatMessages(userId);
  res.json({ rawChatsInfo, lastMessages });
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
