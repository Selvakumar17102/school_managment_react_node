const { User, Teacher } = require('../models');
const bcrypt = require('bcrypt');

exports.createTeacher = async (req, res) => {
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
      ...req.body,
      photo,
      password: hashedPassword,
      role: 'teacher'
    }, { transaction: t });

    const teacher = await Teacher.create({
      ...req.body,
      photo
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Teacher and user created successfully",
      teacher
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating teacher:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.teacherList = async (req, res) => {
  try {
    const teacher = await Teacher.findAll();
    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Failed to fetch teacher list" });
  }
};


exports.getTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;

    const teacher = await Teacher.findByPk(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


exports.updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await teacher.update(req.body);
    res.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res.status(500).json({ error: "Failed to update teacher", details: error.message });
  }
};
