const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  chatType: {
    type: DataTypes.STRING(20),
    validate: {
      isIn: ['Own', 'Dialog', 'Group']
    },
    allowNull: false
  },
  chatAvatarUrl: DataTypes.STRING(512),
  chatTitle: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
});

module.exports = Chat;
