const { Exam,ExamSchedule,Class,Section,Subject } = require('../models');

exports.createExam = async (req, res) => {
  const t = await Exam.sequelize.transaction();
  try {
    const exams = await Exam.create({
      ...req.body
    }, { transaction: t });
    await t.commit();

    res.status(201).json({
      message: "Exam created successfully",
      exams
    });

  } catch (error) {
    await t.rollback();
    console.error("Error creating exams:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.examList = async (req, res) => {
  try {
    const exams = await Exam.findAll();

    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Failed to fetch exams list" });
  }
};

exports.getExamById = async (req, res) => {
    const { id } = req.params;
    try {
        const cls = await Exam.findByPk(id);
        if (!cls) return res.status(404).json({ error: "Exam not found" });
        res.json(cls);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch Exam" });
    }
};

exports.updateExam = async (req, res) => {
    const examId = req.params.id;
    try {
        const updated = await Exam.update(req.body, { where: { id: examId } });
        if (updated[0] === 1) {
            res.json({ message: "Exam updated successfully" });
        } else {
            res.status(404).json({ error: "Exam not found" });
        }
    } catch (error) {
        console.error("Error updating Exam:", error);
        res.status(500).json({ error: "Failed to update Exam" });
    }
};

exports.createExamSchedule = async (req, res) => {
  const t = await ExamSchedule.sequelize.transaction();
  try {
    const newSchedule = await ExamSchedule.create(req.body);
    res.json({ message: "Exam schedule saved", data: newSchedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.getExamSchedulesByClass = async (req, res) => {
  const { classId } = req.params;
  const { sectionId } = req.query;

  const whereClause = { classId };
  if (sectionId) {
    whereClause.sectionId = sectionId;
  }

  try {
    const schedules = await ExamSchedule.findAll({
      where: whereClause,
      include: [
        { model: Class, as: "class", attributes: ["className"] },
        { model: Exam, as: "exam", attributes: ["examName"] },
        { model: Section, as: "section", attributes: ["sectionName"] },
        { model: Subject, as: "subject", attributes: ["subjectName"] },
      ],
    });

    const mapped = schedules.map((item) => ({
      id: item.id,
      classId: item.classId,
      className: item.class?.className,
      examName: item.exam?.examName,
      sectionId: item.sectionId,
      sectionName: item.section?.sectionName,
      subjectName: item.subject?.subjectName,
      date: item.date,
      timeFrom: item.timeFrom,
      timeTo: item.timeTo,
      room: item.room,
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSectionsByClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const sections = await Section.findAll({ where: { classId } });
    res.json(sections);
  } catch (error) {
    console.error("Section fetch error:", error);
    res.status(500).json({ message: "Failed to fetch sections" });
  }
};


exports.getExamScheduleById = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await ExamSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: "Exam schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateExamSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await ExamSchedule.update(req.body, {
      where: { id },
    });

    if (updated[0] === 0) {
      return res.status(404).json({ message: "Exam schedule not found or not changed" });
    }

    res.json({ message: "Exam schedule updated successfully" });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
