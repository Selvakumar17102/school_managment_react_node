const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const upload = require("../middleware/upload");

router.post("/teacher", upload.single("photo"), teacherController.createTeacher);
router.get("/teacherlist", teacherController.teacherList);
router.get("/teachers/:id", teacherController.getTeacherById);
router.put("/updateteachers/:id", upload.single("photo"), teacherController.updateTeacher);

module.exports = router;