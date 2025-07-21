'use strict';

module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    files: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'assignments',
    timestamps: true
  });

  // Define associations
  Assignment.associate = function(models) {
    Assignment.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'class'
    });

    Assignment.belongsTo(models.Section, {
      foreignKey: 'sectionId',
      as: 'section'
    });

    Assignment.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject'
    });
  };

  return Assignment;
};
