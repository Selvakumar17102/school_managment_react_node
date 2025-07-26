module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Tattendance', {
    teacherId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    status: DataTypes.ENUM("Present", "Late Present With Excuse", "Late Present", "Absent")
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
  };

  return Attendance;
};
