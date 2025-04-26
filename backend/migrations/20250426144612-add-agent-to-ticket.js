'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check muna if 'agent' already exists para hindi mag-error
    const tableDescription = await queryInterface.describeTable('Tickets');
    if (!tableDescription.agent) {
      await queryInterface.addColumn('Tickets', 'agent', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove agent column kapag rollback
    const tableDescription = await queryInterface.describeTable('Tickets');
    if (tableDescription.agent) {
      await queryInterface.removeColumn('Tickets', 'agent');
    }
  }
};
