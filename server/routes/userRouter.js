const express = require('express');

const dbapi = require('../db/dbapi');

const router = express.Router();

router.get('/contacts', async (req, res) => {
  res.json({
    contacts: await dbapi.getUsers()
  });
});

router.get('/own', async (req, res) => {
  let user = null;
  if (req.user) {
    user = await dbapi.getUserByName(req.user.username);
  }

  res.json({
    user
  });
});

module.exports = router;
