"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      // define associations here if needed in the future
    }
  }

  Grade.init(
    {
      gradeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gradePoint: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      markFrom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      markUpto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Grade",
      tableName: "Grades",
    }
  );

  return Grade;
};
