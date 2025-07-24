const express = require("express");
const router = express.Router();
const academicController = require("../controllers/academic.controller");
const upload = require("../middleware/upload");

router.post("/saveclass", upload.none(), academicController.createClass);
router.get("/classlist", academicController.classList);
router.get("/class/:id", academicController.getClassById);
router.put("/class/:id", academicController.updateClass);

router.post("/savesection", upload.none(), academicController.createSection);
router.get("/sectionlist", academicController.sectionList);
router.get("/section/:id", academicController.getSectionById);
router.put("/section/:id", academicController.updateSection);

router.get("/sectionlist/:classId", academicController.sectionListByClass);
router.get("/routineclass/:classId", academicController.getRoutinesByClass);


router.post("/savesubject", upload.none(), academicController.createSubject);
router.get("/subjectlist", academicController.subjectList);
router.get("/subject/:id", academicController.getSubjectById);
router.put("/subject/:id", academicController.updateSubject);

router.post("/savesyllabus", upload.array("file", 10), academicController.createSyllabus);
router.get("/syllabuslist", academicController.syllabusList);
router.get("/syllabus/:id", academicController.getSyllabusById);
router.put("/syllabus/:id", upload.array("file", 10), academicController.updateSyllabus);

router.post("/saveAssignment", upload.array("file", 10), academicController.createAssignment);
router.get("/assignmentlist", academicController.assignmentList);
router.get("/assignment/:id", academicController.getAssignmentById);
router.put("/assignment/:id", upload.array("file", 10), academicController.updateAssignment);

router.post("/saveroutines", upload.none(), academicController.createRoutines);

module.exports = router;
