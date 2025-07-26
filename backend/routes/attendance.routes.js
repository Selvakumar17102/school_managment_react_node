const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const upload = require("../middleware/upload");

router.get("/sectionlists/:classId", attendanceController.getSectionsByClassId);
router.get("/studentsattendancelist", attendanceController.getStudentsByClassId);
router.get("/studentlists/:className/:section", attendanceController.getStudentsByClassAndSection);


router.post("/saveSattendance", attendanceController.saveAttendance);
router.post("/saveTattendance", attendanceController.saveTAttendance);
router.post("/saveUattendance", attendanceController.saveUAttendance);


router.get("/sattendance/:studentId", attendanceController.getStudentAttendance);
router.get("/tattendance/:teacherId", attendanceController.getTeacherAttendance);
router.get("/uattendance/:userId", attendanceController.getUserAttendance);


module.exports = router;