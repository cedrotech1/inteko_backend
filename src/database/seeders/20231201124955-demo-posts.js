'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Posts", [
      {
        userID: 1, // Admin user
        categoryID: 1, // Assuming category ID exists
        title: "Admin's Post",
        description: "This is an admin post for testing.",
        image: 'https://res.cloudinary.com/dzl8xve8s/image/upload/v1739974089/Card/tpfxwscg5hfek50yitjc.png',
        status: "approved",
        province_id: 1,
        district_id: 1,
        sector_id: 1,
        cell_id: 1,
        village_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: 2, // Officer user
        categoryID: 2, // Assuming category ID exists
        title: "Officer's Post",
        description: "This is a post by an officer.",
        image: 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1724766686/Card/nrujel7xhcokiikabpyj.png',
        status: "approved",
        province_id: 1,
        district_id: 1,
        sector_id: 1,
        cell_id: 1,
        village_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Posts", null, {});
  }
};
