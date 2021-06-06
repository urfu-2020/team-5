const express = require('express');
const { getUsers, updateTheme } = require('../db/dbapi');

const router = express.Router();

/**
 * Получить всех пользователей
 */
router.get('/contacts', async (req, res) => {
  res.json({
    contacts: await getUsers()
  });
});

/**
 * Получить данные о текущем пользователе (после авторизации)
 */
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

router.get('/theme/:isDarkTheme', async (req, res) => {
  const boolTheme = req.params.isDarkTheme === 'true';
  if (req.user) {
    await updateTheme(req.user.id, boolTheme);
    res.status(200).end();
  }
});

module.exports = router;
