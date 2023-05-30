'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Photos', [
      {
        title: 'Photo 1',
        caption: 'Caption 1',
        poster_image_url: 'https://picsum.photos/200/300',
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId : 1
      },
      {
        title: 'Photo 2',
        caption: 'Caption 2',
        poster_image_url: 'https://picsum.photos/200/300',
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId : 1
      },
      {
        title: 'Photo 3',
        caption: 'Caption 3',
        poster_image_url: 'https://picsum.photos/200/300',
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId : 1
      }
    ], {})
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Photos', null, {})
  }
};
