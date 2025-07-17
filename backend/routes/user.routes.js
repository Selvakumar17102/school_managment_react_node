const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require("../middleware/upload");

router.post('/login', userController.login);
router.post('/register', userController.register);

router.get("/userlist", userController.getUsers);
router.get("/roles", userController.roleList);
router.post("/user", upload.single("photo"), userController.createUser);
router.get("/users/:id", userController.getUserById);
router.put("/updateusers/:id", upload.single("photo"), userController.updateUser);

module.exports = router;
