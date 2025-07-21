module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define("Subject", {
    classId: DataTypes.INTEGER,
    teacherId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    passmark: DataTypes.INTEGER,
    finalmark: DataTypes.INTEGER,
    subjectName: DataTypes.STRING,
    subjectAuthor: DataTypes.STRING,
    subjectCode: DataTypes.STRING,
  });

  Subject.associate = (models) => {
    Subject.belongsTo(models.Class, { foreignKey: 'classId' });
    Subject.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
  };

  return Subject;
};
