'use strict';
import bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    const hashedPasswordAdmin = await bcrypt.hash("1234", saltRounds);
    const hashedPasswordProvinceLeader = await bcrypt.hash("1234", saltRounds);
    const hashedPasswordDistrictLeader = await bcrypt.hash("1234", saltRounds);
    const hashedPasswordSectorLeader = await bcrypt.hash("1234", saltRounds);
    const hashedPasswordCellLeader = await bcrypt.hash("1234", saltRounds);
    const hashedPasswordVillageLeader = await bcrypt.hash("1234", saltRounds);

    return queryInterface.bulkInsert("Users", [
      {
        firstname: "admin",
        lastname: "Mado",
        email: "admin@gmail.com",
        phone: "0780000000",
        role: "admin", // Admin role
        status: "active",
        password: hashedPasswordAdmin,
        gender: "Male",
        image: 'https://res.cloudinary.com/dzl8xve8s/image/upload/v1739974089/Card/tpfxwscg5hfek50yitjc.png',
        province_id: null,
        district_id: null,
        sector_id: null,
        cell_id: null,
        village_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "John",
        lastname: "Doe",
        email: "province_leader@gmail.com",
        phone: "0781234567",
        role: "province_leader", // Province Leader role
        status: "active",
        password: hashedPasswordProvinceLeader,
        gender: "Male",
        image: 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1724766686/Card/nrujel7xhcokiikabpyj.png',
        province_id: 1,
        district_id: null,
        sector_id: null,
        cell_id: null,
        village_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Jane",
        lastname: "Smith",
        email: "district_leader@gmail.com",
        phone: "0787654321",
        role: "district_leader", // District Leader role
        status: "active",
        password: hashedPasswordDistrictLeader,
        gender: "Female",
        image: 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1724766686/Card/nrujel7xhcokiikabpyj.png',
        province_id: 1,
        district_id: 1,
        sector_id: null,
        cell_id: null,
        village_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Michael",
        lastname: "Johnson",
        email: "sector_leader@gmail.com",
        phone: "0788765432",
        role: "sector_leader", // Sector Leader role
        status: "active",
        password: hashedPasswordSectorLeader,
        gender: "Male",
        image: 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1724766686/Card/nrujel7xhcokiikabpyj.png',
        province_id: 1,
        district_id: 1,
        sector_id: 1,
        cell_id: null,
        village_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Sarah",
        lastname: "Williams",
        email: "cell_leader@gmail.com",
        phone: "0789876543",
        role: "cell_leader", // Cell Leader role
        status: "active",
        password: hashedPasswordCellLeader,
        gender: "Female",
        image: 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1724766686/Card/nrujel7xhcokiikabpyj.png',
        province_id: 1,
        district_id: 1,
        sector_id: 1,
        cell_id: 1,
        village_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "David",
        lastname: "Brown",
        email: "village_leader@gmail.com",
        phone: "0781112233",
        role: "village_leader", // Village Leader role
        status: "active",
        password: hashedPasswordVillageLeader,
        gender: "Male",
        image: 'http://res.cloudinary.com/dzl8xve8s/image/upload/v1724766686/Card/nrujel7xhcokiikabpyj.png',
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
    return queryInterface.bulkDelete("Users", null, {});
  }
};
