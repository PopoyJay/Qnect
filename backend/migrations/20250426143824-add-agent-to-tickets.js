'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tickets', 'agent');
  }
};
