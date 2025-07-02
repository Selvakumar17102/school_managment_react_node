const { User, Student } = require('../models');
const bcrypt = require('bcrypt');

exports.createStudent = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const { name, email, password } = req.body;
    const photo = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists in users" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student'
    }, { transaction: t });

    const student = await Student.create({
      ...req.body,
      photo
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Student and user created successfully",
      student
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.studentList = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch student list" });
  }
};
