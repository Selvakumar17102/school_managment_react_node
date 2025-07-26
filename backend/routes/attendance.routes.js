const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const upload = require("../middleware/upload");

router.get("/sectionlists/:classId", attendanceController.getSectionsByClassId);

router.get("/studentlists/:className/:section", attendanceController.getStudentsByClassAndSection);
router.post("/saveSattendance", attendanceController.saveAttendance);

module.exports = router;