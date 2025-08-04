const express = require("express");
const router = express.Router();
const markController = require("../controllers/mark.controller");

router.post("/submit-marks", markController.submitMarks);

router.get("/view-student-profile/:id", markController.getStudentProfile);
router.get("/view-mark-details/:id", markController.getStudentMarkDetails);


module.exports = router;