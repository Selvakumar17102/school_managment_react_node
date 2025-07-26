const { User, Student,sequelize  } = require('../models');
const bcrypt = require('bcrypt');

exports.createStudent = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const { name, dob,gender,religion,email,phone,address,admissionDate,username, password } = req.body;
    const photo = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists in users" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      dob,
      gender,
      religion,
      email,
      phone,
      address,
      joiningDate : admissionDate,
      photo,
      username,
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
    const [students] = await sequelize.query(`
      SELECT s.*, 
             c.className AS classNameLabel, 
             sec.sectionName AS sectionLabel
      FROM students s
      LEFT JOIN classes c ON s.className = c.id
      LEFT JOIN sections sec ON s.section = sec.id
    `);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch student list" });
  }
};


exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.update(req.body);
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ error: "Failed to update student", details: error.message });
  }
};
