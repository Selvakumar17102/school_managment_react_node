"use strict";
module.exports = (sequelize, DataTypes) => {
  const ExamSchedule = sequelize.define(
    "ExamSchedule",
    {
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      examId: {
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      timeFrom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeTo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      room: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {}
  );

  ExamSchedule.associate = function (models) {
    ExamSchedule.belongsTo(models.Class, { foreignKey: "classId" });
    ExamSchedule.belongsTo(models.Exam, { foreignKey: "examId" });
    ExamSchedule.belongsTo(models.Section, { foreignKey: "sectionId" });
    ExamSchedule.belongsTo(models.Subject, { foreignKey: "subjectId" });
  };


  ExamSchedule.associate = (models) => {
    ExamSchedule.belongsTo(models.Class, { foreignKey: "classId", as: "class" });
    ExamSchedule.belongsTo(models.Exam, { foreignKey: "examId", as: "exam" });
    ExamSchedule.belongsTo(models.Section, { foreignKey: "sectionId", as: "section" });
    ExamSchedule.belongsTo(models.Subject, { foreignKey: "subjectId", as: "subject" });
  };

  return ExamSchedule;
};
