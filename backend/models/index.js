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

db.sequelize = sequelize;
db.sequelize = sequelize;

const User = require('./user.model');
const Student = require('./student.model')(sequelize, Sequelize.DataTypes);
const Parent = require('./parent.model')(sequelize, Sequelize.DataTypes);
const Teacher = require('./teacher.model')(sequelize, Sequelize.DataTypes);
const MasterRole = require('./masterrole.model')(sequelize, Sequelize.DataTypes);


db.User = User;
db.Student = Student;
db.Parent = Parent;
db.Teacher = Teacher;
db.MasterRole = MasterRole;

module.exports = db;

