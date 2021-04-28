const express = require('express');

const dbapi = require('../db/dbapi');

const router = express.Router();

router.get('/users', async (req, res) => {
  res.json({
    users: await dbapi.getUsers()
  });
});

module.exports = router;
