'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('master_roles', [
      { role_name: 'superadmin', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'teacher', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'student', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'parent', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'principal', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'vice_principal', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'coordinator', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'assistant_teacher', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'clerk', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'librarian', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'accountant', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'peon', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'security', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'driver', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'cleaner', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'hostel_warden', createdAt: new Date(), updatedAt: new Date() },
      { role_name: 'lab_assistant', createdAt: new Date(), updatedAt: new Date() },
    ]); 
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_roles', null, {});
  }
};
