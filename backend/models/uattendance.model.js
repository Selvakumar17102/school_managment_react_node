module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Uattendance', {
    userId: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    status: DataTypes.ENUM("Present", "Late Present With Excuse", "Late Present", "Absent")
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Attendance;
};
