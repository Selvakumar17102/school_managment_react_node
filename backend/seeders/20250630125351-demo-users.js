'use strict';
const bcrypt = require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Super Admin',
        email: 'superadmin@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'superadmin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teacher A',
        email: 'teacher@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Student',
        email: 'student@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Parent',
        email: 'parent@gmail.com',
        password: await bcrypt.hash('123', 10),
        role: 'parent',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
