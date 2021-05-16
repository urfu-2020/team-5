const express = require('express');

const { getChatMessages } = require('../db/dbapi');

const router = express.Router();

router.get('/:chatId/:offset/:count', async (req, res) => {
  const { chatId, offset, count } = req.params;
  const oldMessages = (await getChatMessages(+chatId, +offset, +count)).reverse();
  res.json({
    oldMessages
  });
});

module.exports = router;
