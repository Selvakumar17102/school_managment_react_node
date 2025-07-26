const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Register failed', error: err.message });
  }
};

const createUser = async (req, res) => {

  const {
    name,
    dob,
    gender,
    religion,
    email,
    phone,
    address,
    joiningDate,
    photo, 
    role,
    username,
    password
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = req.file ? req.file.filename : null;

    const user = await db.User.create({
      name,
      dob,
      gender,
      religion,
      email,
      phone,
      address,
      joiningDate,
      photo,
      role,
      username,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ message: "User registration failed", error: err.message });
  }
};

const roleList = async (req, res) => {
  try {
    const roles = await db.MasterRole.findAll({
      attributes: ["id", "role_name"],
      order: [["role_name", "ASC"]],
    });

    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching role list:", error);
    res.status(500).json({ error: "Failed to fetch role list" });
  }
};

const getUsers = async (req, res) => {
  try {
    const alluser = await db.User.findAll({
      where: {
        role: {
          [Op.notIn]: ["superadmin", "admin", "teacher", "student", "parent"]
        }
      }
    });

    res.status(200).json(alluser);
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Failed to fetch teacher list" });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update(req.body);
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user", details: error.message });
  }
};

module.exports = {
  login,
  register,
  getUsers,
  roleList,
  createUser,
  getUserById,
  updateUser,
};
