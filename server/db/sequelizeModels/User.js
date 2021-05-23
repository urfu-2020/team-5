const { DataTypes } = require('sequelize');
const sequelize = require('../sequelizeConfig');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatarUrl: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  githubUrl: {
    type: DataTypes.STRING(512)
  }
}, {
  tableName: 'Users',
  timestamps: false
});

module.exports = User;
