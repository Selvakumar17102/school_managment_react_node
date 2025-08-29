const express = require("express");
const router = express.Router();
const markController = require("../controllers/mark.controller");

router.post("/submit-marks", markController.submitMarks);

router.get("/view-student-profile/:id", markController.getStudentProfile);
router.get("/view-mark-details/:id", markController.getStudentMarkDetails);

router.post("/savemarkdistribution", markController.createMarkdistribution);
router.get("/markdistributionlist", markController.markDistributionList);
router.get("/markdistribution/:id", markController.getMarkDistributionById);
router.put("/markdistribution/:id", markController.updateMarkDistribution);         
 
module.exports = router;