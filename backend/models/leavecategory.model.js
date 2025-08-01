'use strict';
module.exports = (sequelize, DataTypes) => {
  const LeaveCategory = sequelize.define('LeaveCategory', {
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  return LeaveCategory;
};
