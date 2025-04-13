module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("Department", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  Department.associate = (models) => {
    Department.hasMany(models.Ticket, { foreignKey: "departmentId" });
  };

  return Department;
};
