const express = require("express");
const router = express.Router();
const examController = require("../controllers/exam.controller");
const upload = require("../middleware/upload");

router.post("/saveexam", upload.none(), examController.createExam);
router.get("/examlist", examController.examList);
router.get("/exam/:id", examController.getExamById);
router.put("/exam/:id", examController.updateExam);

module.exports = router;