const { Sequelize } = require('sequelize');

const CONNECTION_URL = process.env.DATABASE_CONNECTION_STRING;

const sequelize = new Sequelize(CONNECTION_URL, {
  logging: process.env.NODE_ENV === 'production' ? false : console.log
});

module.exports = sequelize;
