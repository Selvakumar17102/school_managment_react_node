'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MarkDistribution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MarkDistribution.init({
    markDistributionType: DataTypes.STRING,
    markValue: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MarkDistribution',
  });
  return MarkDistribution;
};               