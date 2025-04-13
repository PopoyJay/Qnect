module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: { type: DataTypes.TEXT, allowNull: false },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Ticket, { foreignKey: "ticketId", onDelete: "CASCADE" });
    Comment.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return Comment;
};

