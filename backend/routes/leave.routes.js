const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");
const upload = require("../middleware/upload");


router.post("/saveleavecategory", upload.none(), leaveController.createLeaveCategory);
router.get("/leavecategorylist", leaveController.leaveCategoryList);
router.get("/leavecategory/:id", leaveController.getLeaveCategoryById);
router.put("/leavecategory/:id", leaveController.updateLeaveCategory);

router.post("/saveleaveassign", upload.none(), leaveController.createLeaveAssign);
router.get("/leaveassignlist", leaveController.leaveAssignList);
router.get("/leaveassign/:id", leaveController.getLeaveAssignById);
router.put("/leaveassign/:id", leaveController.updateLeaveAssign); 
module.exports = router;