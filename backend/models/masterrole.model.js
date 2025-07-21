module.exports = (sequelize, DataTypes) => {
  const MasterRole = sequelize.define("Master_roles", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    }
  }, {
    tableName: "master_roles",
    timestamps: true
  });

  return MasterRole;
};
