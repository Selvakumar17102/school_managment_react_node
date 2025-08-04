const { User, Parent } = require('../models');
const bcrypt = require('bcrypt');

exports.createParent = async (req, res) => {
  const t = await User.sequelize.transaction();
  try {

    const {
      guardianName,
      fatherName,
      motherName,
      fatherProfession,
      motherProfession,
      email,
      phone,
      address,
      username,
      password
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: guardianName,
      dob : 'NA',
      gender : 'NA',
      religion : 'NA',
      email,
      phone,
      address,
      joiningDate : 'NA',
      photo,
      username,
      password: hashedPassword,
      role: 'parent'
    }, { transaction: t });

    const parent = await Parent.create({
      guardianName,
      fatherName,
      motherName,
      fatherProfession,
      motherProfession,
      email,
      phone,
      address,
      photo,
      username,
      password: hashedPassword
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: "Parent and user created successfully",
      parent
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.parentlist = async (req, res) => {
  try {
    const parents = await Parent.findAll();
    res.status(200).json(parents);
  } catch (error) {
    console.error("Error fetching parents:", error);
    res.status(500).json({ error: "Failed to fetch parents list" });
  }
};

exports.getParentById = async (req, res) => {
  try {
    const parentId = req.params.id;
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: "parent not found" });
    }

    res.json(parent);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


exports.updateParent = async (req, res) => {
  try {
    const parentId = req.params.id;
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Student not found" });
    }

    await parent.update(req.body);
    res.json({ message: "parent updated successfully", parent });
  } catch (error) {
    res.status(500).json({ error: "Failed to update parent", details: error.message });
  }
};