const express = require('express');

const { getChatMessages } = require('../db/dbapi');

const router = express.Router();

router.get('/:chatId/:offset', async (req, res) => {
  const oldMessages = (await getChatMessages(+req.params.chatId, +req.params.offset, 20)).reverse();
  res.json({
    oldMessages
  });
});

module.exports = router;
