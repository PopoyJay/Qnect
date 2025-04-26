'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the column with NULL allowed
    await queryInterface.addColumn('Tickets', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // allow NULLs to avoid issues on existing data
    });

    // Step 2: Add the foreign key constraint
    await queryInterface.addConstraint('Tickets', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_user', // custom name for constraint
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'RESTRICT' or 'CASCADE' based on your needs
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First remove the foreign key constraint
    await queryInterface.removeConstraint('Tickets', 'fk_user');

    // Then remove the column
    await queryInterface.removeColumn('Tickets', 'userId');
  }
};
