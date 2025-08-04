module.exports = (sequelize, DataTypes) => {
  const Mark = sequelize.define("Mark", {
    studentId: DataTypes.INTEGER,
    classId: DataTypes.INTEGER,
    examId: DataTypes.INTEGER,
    sectionId: DataTypes.INTEGER,
    subjectId: DataTypes.INTEGER,
    exam: DataTypes.INTEGER,
    attendance: DataTypes.INTEGER,
    classTest: DataTypes.INTEGER,
    assignment: DataTypes.INTEGER,
  });

  Mark.associate = (models) => {
    Mark.belongsTo(models.Student, { foreignKey: "studentId" });
    Mark.belongsTo(models.Exam, { foreignKey: "examId" });
    Mark.belongsTo(models.Subject, { foreignKey: "subjectId" });
    Mark.belongsTo(models.Class, { foreignKey: "classId" });
    Mark.belongsTo(models.Section, { foreignKey: "sectionId" });
  };

  return Mark;
};
