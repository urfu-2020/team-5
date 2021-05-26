const { Sequelize } = require('sequelize');

const sequelizeConnection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_SERVER,
  dialect: 'mssql'
});

module.exports = sequelizeConnection;
