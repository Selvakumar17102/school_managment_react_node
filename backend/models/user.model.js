const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'teacher', 'student', 'parent'),
    defaultValue: 'student',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
