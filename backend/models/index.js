// const sequelize = require('../config/db');
// const Sequelize = require('sequelize');

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Models
// db.User = require('./user.model.js')(sequelize, Sequelize.DataTypes);

// module.exports = db;


const sequelize = require('../config/db');
const Sequelize = require('sequelize'); // You need Sequelize for DataTypes
const db = {};

const User = require('./user.model');
const Student = require('./student.model')(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;  // export Sequelize if needed
db.User = User;
db.Student = Student;

module.exports = db;

