module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define("Teacher", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    religion: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    joiningDate: DataTypes.DATEONLY,
    photo: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      // unique: true,
    },
    password: DataTypes.STRING,
  });

  Teacher.associate = (models) => {
    Teacher.hasMany(models.Class, {
      foreignKey: "classTeacher",
      as: "classes"
    });

    Teacher.hasMany(models.Section, {
      foreignKey: "classTeacher",
      as: "sections"
    });

    Teacher.hasMany(models.Subject, {
      foreignKey: "classTeacher",
      as: "subjects"
    });
  };

  return Teacher;
};
