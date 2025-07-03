const express = require("express");
const router = express.Router();
const parentController = require("../controllers/parent.controller");
const upload = require("../middleware/upload");

router.post("/parents", upload.single("photo"), parentController.createParent);
router.get("/parentslist", parentController.parentlist);
router.get("/parents/:id", parentController.getParentById);
router.put("/updateparents/:id", upload.single("photo"), parentController.updateParent);

module.exports = router;