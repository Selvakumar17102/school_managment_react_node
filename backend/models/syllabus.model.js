'use strict';
module.exports = (sequelize, DataTypes) => {
  const Syllabus = sequelize.define('Syllabus', {
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    files: {
      type: DataTypes.JSON
    }
  }, {
    tableName: 'Syllabuses'
  });

  Syllabus.associate = (models) => {
    Syllabus.belongsTo(models.Class, { foreignKey: 'classId' });
  };

  return Syllabus;
};
