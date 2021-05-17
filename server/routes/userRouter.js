const express = require('express');

const {
  getUserChats, getUserLastChatMessages, getUsers
} = require('../db/dbapi');

const router = express.Router();

router.get('/contacts', async (req, res) => {
  res.json({
    contacts: await getUsers()
  });
});

router.get('/:userId/chatsData', async (req, res) => {
  if (req.user && +req.params.userId === req.user.id) {
    const userId = +req.params.userId;
    const rawChatsInfo = await getUserChats(userId);
    const lastMessages = await getUserLastChatMessages(userId);
    res.json({ rawChatsInfo, lastMessages });
  } else {
    res.status(403).json({ error: 'Вы не можете получить эти данные' });
  }
});

router.get('/self', async (req, res) => {
  let user;
  if (req.user) {
    const { isNewUser, ...sessionUser } = req.user;
    user = sessionUser;
  }
  res.json({
    user
  });
});

module.exports = router;
