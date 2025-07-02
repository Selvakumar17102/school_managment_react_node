module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define("Student", {
    name: DataTypes.STRING,
    guardian: DataTypes.STRING,
    admissionDate: DataTypes.DATEONLY,
    dob: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    bloodGroup: DataTypes.STRING,
    religion: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    className: DataTypes.STRING,
    section: DataTypes.STRING,
    optionalSubject: DataTypes.STRING,
    registerNo: DataTypes.STRING,
    roll: DataTypes.STRING,
    photo: DataTypes.STRING,
    activities: DataTypes.TEXT,
    remarks: DataTypes.TEXT,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  return Student;
};
