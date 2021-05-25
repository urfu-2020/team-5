const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');
const Chat = require('./chat');
const User = require('./user');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true
  },
  chatId: {
    type: DataTypes.INTEGER,
    references: {
      model: Chat,
      key: 'id',
      allowNull: false
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
      allowNull: false
    }
  },
  text: DataTypes.STRING(65535),
  hasAttachments: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(36),
    allowNull: false,
    isIn: [['Read', 'Unread', 'UnSend']]
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Messages',
  timestamps: false
});

module.exports = Message;
