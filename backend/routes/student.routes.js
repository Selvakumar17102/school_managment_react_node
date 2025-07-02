const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const upload = require("../middleware/upload");

router.post("/students", upload.single("photo"), studentController.createStudent);

module.exports = router;
