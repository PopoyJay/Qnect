// Ticket model
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Open',
    },
    priority: {
      type: DataTypes.STRING,
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agent: {
      type: DataTypes.INTEGER,
      allowNull: true, // You can still allow null if you want to leave it blank
      defaultValue: null, // Or a default value like null or 0
    },
  });

  return Ticket;
};
