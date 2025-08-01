'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExamAttendance = sequelize.define('ExamAttendance', {
    studentId: {
      type: DataTypes.INTEGER,
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
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'ExamAttendances',
  });

  ExamAttendance.associate = function(models) {
    ExamAttendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    ExamAttendance.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    ExamAttendance.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
    ExamAttendance.belongsTo(models.Exam, { foreignKey: 'examId', as: 'exam' });
    ExamAttendance.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
  };

  return ExamAttendance;
};
