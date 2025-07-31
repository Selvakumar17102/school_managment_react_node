const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");
const upload = require("../middleware/upload");

router.post("/saveexam", upload.none(), examController.createExam);
router.get("/examlist", examController.examList);
router.get("/exam/:id", examController.getExamById);
router.put("/exam/:id", examController.updateExam);

router.post("/saveexamschedule", upload.none(), examController.createExamSchedule);
router.get("/examschedulelist/:classId", examController.getExamSchedulesByClass);

router.get("/getsectionsbyclass/:classId", examController.getSectionsByClass);

router.get("/editexamschedule/:id", examController.getExamScheduleById);
router.put("/updateexamschedule/:id", examController.updateExamSchedule);

router.post("/savegrade", upload.none(), examController.createGrade);
router.get("/gradelist", examController.gradeList);
router.get("/grade/:id", examController.getGradeById);
router.put("/grade/:id", examController.updateGrade);

module.exports = router;