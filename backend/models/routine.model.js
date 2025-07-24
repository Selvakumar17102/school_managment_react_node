'use strict';
module.exports = (sequelize, DataTypes) => {
  const Routine = sequelize.define('Routine', {
    schoolYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'routines',
    timestamps: true,
  });

  Routine.associate = function(models) {
    Routine.belongsTo(models.Class, {
      foreignKey: 'classId',
      as: 'class',
    });
    Routine.belongsTo(models.Section, {
      foreignKey: 'sectionId',
      as: 'section',
    });
    Routine.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject',
    });
    Routine.belongsTo(models.Teacher, {
      foreignKey: 'teacherId',
      as: 'teacher',
    });
  };

  return Routine;
};
