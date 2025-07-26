const { Class, Teacher,Section,Subject,Syllabus,Assignment,Routine,Student,Sattendance  } = require('../models');

exports.getSectionsByClassId = async (req, res) => {
  const { classId } = req.params;

  try {
    const sections = await Section.findAll({
      where: { classId },
      attributes: ["id", "sectionName"],
    });
    res.json(sections);
  } catch (err) {
    console.error("Section fetch error:", err);
    res.status(500).json({ error: "Failed to fetch sections" });
  }
};


exports.getStudentsByClassAndSection = async (req, res) => {
  const { className, section } = req.params;

  try {
    const students = await Student.findAll({
      where: {
        className,
        section,
      },
      attributes: ["id", "name", "email", "photo", "roll"],
      order: [["roll", "ASC"]],
    });

    res.json(students);
  } catch (error) {
    console.error("Student fetch error:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};


exports.saveAttendance = async (req, res) => {

  const { date, classId, sectionId, records } = req.body;

  try {
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    const attendanceData = records.map(rec => ({
        studentId: rec.studentId,
        classId,
        sectionId,
        date,
        status: rec.status
    }));

    await Sattendance.bulkCreate(attendanceData);

    res.status(200).json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Failed to save attendance" });
  }
};