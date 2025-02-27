'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Notifications', [
      {
        userID: 1, // assuming user with ID 1 exists
        title: 'new post',
        message: 'A new post has been added',
        type: 'alert',
        isRead: false, // Unread notification
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Notifications', null, {});
  }
};
