module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Sattendance', {
    studentId: DataTypes.INTEGER,
    classId: DataTypes.INTEGER,
    sectionId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    status: DataTypes.ENUM("Present", "Late Present With Excuse", "Late Present", "Absent")
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student, { foreignKey: 'studentId' });
  };

  return Attendance;
};
