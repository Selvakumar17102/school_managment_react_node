'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaveAssign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LeaveAssign.init({
    roleId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    noOfDays: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LeaveAssign',
  });
  return LeaveAssign;
};