'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'Personal Information',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'certificates',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'skills',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'trainning',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
