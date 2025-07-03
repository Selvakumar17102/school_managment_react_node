module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define("Parent", {
    guardianName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherName: DataTypes.STRING,
    motherName: DataTypes.STRING,
    fatherProfession: DataTypes.STRING,
    motherProfession: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    photo: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  return Parent;
};
