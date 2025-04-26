'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Tickets', 'title', 'subject');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Tickets', 'subject', 'title');
  }
};
