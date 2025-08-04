const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
const upload = require("../middleware/upload");

router.post("/students", upload.single("photo"), studentController.createStudent);
router.get("/studentslist", studentController.studentList);
router.get("/students/:id", studentController.getStudentById);
router.put("/updatestudents/:id", upload.single("photo"), studentController.updateStudent);

router.get("/get-mark-students",studentController.getMarkStudents);

module.exports = router;