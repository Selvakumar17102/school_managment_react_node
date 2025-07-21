module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define("Section", {
    sectionName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    classTeacher: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });

  Section.associate = (models) => {
    Section.belongsTo(models.Class, { foreignKey: 'classId' });
    Section.belongsTo(models.Teacher, { foreignKey: 'classTeacher' });
  };

  return Section;
};
