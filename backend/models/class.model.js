module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("Class", {
    className: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classNumeric: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classTeacher: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    }
  });

  Class.associate = (models) => {
    Class.belongsTo(models.Teacher, { foreignKey: "classTeacher" });
    Class.hasMany(models.Section, { foreignKey: "classId" });
  };

  return Class;
};
