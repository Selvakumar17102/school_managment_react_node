'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Optional: Get role IDs dynamically if master_roles are seeded
    const roles = await queryInterface.sequelize.query(
      `SELECT id,role_name FROM master_roles`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const getRoleId = (name) => {
      const role = roles.find(r => r.role_name.toLowerCase() === name.toLowerCase());
      return role ? role.role_name : null;
    };

    return queryInterface.bulkInsert('Users', [
      {
        name: 'Super Admin',
        dob: '1980-01-01',
        gender: 'Male',
        religion: 'None',
        email: 'superadmin@gmail.com',
        phone: '9999999999',
        address: 'System HQ',
        joiningDate: '2020-01-01',
        photo: null,
        username: 'superadmin',
        password: await bcrypt.hash('123', 10),
        role: getRoleId('superadmin'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        dob: '1985-01-01',
        gender: 'Male',
        religion: 'None',
        email: 'admin@gmail.com',
        phone: '8888888888',
        address: 'Admin HQ',
        joiningDate: '2021-01-01',
        photo: null,
        username: 'admin',
        password: await bcrypt.hash('123', 10),
        role: getRoleId('admin'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teacher A',
        dob: '1990-05-15',
        gender: 'Female',
        religion: 'Hindu',
        email: 'teacher@gmail.com',
        phone: '7777777777',
        address: 'Block A',
        joiningDate: '2022-06-10',
        photo: null,
        username: 'teacher1',
        password: await bcrypt.hash('123', 10),
        role: getRoleId('teacher'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Student',
        dob: '2005-07-20',
        gender: 'Male',
        religion: 'Christian',
        email: 'student@gmail.com',
        phone: '6666666666',
        address: 'Hostel A',
        joiningDate: '2023-06-15',
        photo: null,
        username: 'student1',
        password: await bcrypt.hash('123', 10),
        role: getRoleId('student'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Parent',
        dob: '1975-03-22',
        gender: 'Female',
        religion: 'Muslim',
        email: 'parent@gmail.com',
        phone: '5555555555',
        address: 'Home Zone',
        joiningDate: '2023-04-01',
        photo: null,
        username: 'parent1',
        password: await bcrypt.hash('123', 10),
        role: getRoleId('parent'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
