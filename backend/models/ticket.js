// models/ticket.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Open',
    },
    agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Medium', // or any default you want
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Departments',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      }
    },
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Ticket.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });
    Ticket.belongsTo(models.User, {
      foreignKey: 'userId', // Make sure this matches the column name in the model
      as: 'user',  // Change alias here to match your query
    });
  };

  return Ticket;
};
