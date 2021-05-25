const { DataTypes } = require('sequelize');

const sequelizeConnection = require('../sequelizeConfig');
const Chat = require('./chat');
const User = require('./user');

const ChatUser = sequelizeConnection.define('UserChat', {
  chatId: {
    type: DataTypes.INTEGER,
    references: {
      model: Chat,
      key: 'id',
      allowNull: false
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
      allowNull: false
    }
  }
}, {
  tableName: 'ChatUsers',
  timestamps: false
});
ChatUser.removeAttribute('id');

module.exports = ChatUser;
