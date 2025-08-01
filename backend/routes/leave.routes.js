const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");
const upload = require("../middleware/upload");


router.post("/saveleavecategory", upload.none(), leaveController.createLeaveCategory);
router.get("/leavecategorylist", leaveController.leaveCategoryList);
router.get("/leavecategory/:id", leaveController.getLeaveCategoryById);
router.put("/leavecategory/:id", leaveController.updateLeaveCategory);


module.exports = router;