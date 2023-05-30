'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Comments', [
      {
        comment: 'Wow, this is so cool!',
        UserId: 1,
        PhotoId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        comment: 'Wow, this is so cool!',
        UserId: 1,
        PhotoId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        comment: 'Wow, this is so cool!',
        UserId: 1,
        PhotoId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
