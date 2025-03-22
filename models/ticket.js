module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define("Ticket", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Open" },
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
    Ticket.belongsTo(models.Category, { foreignKey: "categoryId", onDelete: "SET NULL" });
    Ticket.belongsTo(models.Department, { foreignKey: "departmentId", onDelete: "SET NULL" });
  };

  return Ticket;
};
