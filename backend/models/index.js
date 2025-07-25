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
const Class = require('./class.model')(sequelize, Sequelize.DataTypes);
const Section = require("./section.model.js")(sequelize, Sequelize);
const Subject = require("./subject.model.js")(sequelize, Sequelize);
const Syllabus = require("./syllabus.model.js")(sequelize, Sequelize);
const Assignment = require("./assignment.model.js")(sequelize, Sequelize);
const Routine = require("./routine.model.js")(sequelize, Sequelize);
const Sattendance = require("./sattendance.model.js")(sequelize, Sequelize);
const Tattendance = require("./tattendance.model.js")(sequelize, Sequelize);
const Uattendance = require("./uattendance.model.js")(sequelize, Sequelize);


db.User = User;
db.Student = Student;
db.Parent = Parent;
db.Teacher = Teacher;
db.MasterRole = MasterRole;
db.Class = Class;
db.Section = Section;
db.Subject = Subject;
db.Syllabus = Syllabus;
db.Assignment = Assignment;
db.Routine = Routine;
db.Sattendance = Sattendance;
db.Tattendance = Tattendance;
db.Uattendance = Uattendance;

module.exports = db;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);  
  }
});

